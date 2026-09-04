from utils import create_token, hass_password
from database import get_db
from models import User,AnalysisData
from fastapi import FastAPI, Depends, HTTPException, status,UploadFile,File,Form
from schema import RegisterSchema
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from main import run_automated_pipeline
import os
import shutil
 
app = FastAPI()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post('/register')
def register(user: RegisterSchema,db: Session = Depends(get_db) ):
    userExist = db.query(User).filter(User.email == user.email).first()
    if userExist :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="User Already Exist")

    hass_Pass = hass_password.hashpassword(user.password)

    new_user = User(
        username = user.username,
        email = user.email,
        password = hass_Pass
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"Message": "Signup Successfull"}


@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    userExit = db.query(User).filter(User.username == form_data.username).first()

    if not userExit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User Not Found")

    if not hass_password.verifyPassword(form_data.password,userExit.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Invalid Credential")

    token_data = {"sub": str(userExit.id)}
    token = create_token.create_token(token_data)

    return {"access_token": token,"token_type": "bearer"}



@app.post('/dashboard')
async def dashboard(
    user_text: str = Form(...),
    image: UploadFile = File(...),
    current_user: dict = Depends(create_token.get_current_user),
    db: Session = Depends(get_db)):

    if not image.content_type.startswith("image/"):
        return {"error": "Only Image files are Allowed"}

    file_path = os.path.join(UPLOAD_DIR, image.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    date = [datetime.now().strftime("%X"),datetime.now().strftime("%x")]
    feedback = run_automated_pipeline(file_path)

    new_data = AnalysisData(
        text = user_text,
        upload = file_path,
        analysis = feedback,
        createdAt = " ".join(date),
        userId = current_user['user_id'],
    )

    db.add(new_data)
    db.commit()
    db.refresh(new_data)

    return {
        "ocr_text": user_text,
        "Feedback": feedback
    }


@app.get("/history")
def chatHistory(current_user: dict = Depends(create_token.get_current_user),
    db: Session = Depends(get_db)):

    user_id = int(current_user['user_id'])
    user_history = db.query(AnalysisData).filter(User.id == user_id).all()
    return user_history


# Need to improve user data model 
# create a profile page
