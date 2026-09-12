from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from schema import RegisterSchema,ProfileSchema, ProfileUpdateSchema
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from utils import create_token, hass_password
from fastapi.staticfiles import StaticFiles
from main import run_automated_pipeline
from models import User,AnalysisData
from sqlalchemy.orm import Session
from datetime import datetime
from database import get_db
import shutil
import json
import os
 
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.post('/register')
def register(user: str = Form(...), image: UploadFile = File(...),db: Session = Depends(get_db) ):

    # CODE
    user = RegisterSchema.model_validate(json.loads(user))

    userExist = db.query(User).filter(User.email == user.email).first()
    if userExist :
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="User Already Exist")

    if user.create_password != user.confirm_password:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="password not match")

    file_path = os.path.join(UPLOAD_DIR, image.filename)
    contents = image.file.read()

    with open(file_path, "wb") as f:
        f.write(contents)

    hass_Pass = hass_password.hashpassword(user.confirm_password)

    new_user = User(
        image = file_path,
        username = user.username,
        age = user.age,
        studentClass = user.studentClass,
        description = user.description,
        email = user.email,
        password = hass_Pass
    )
    

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"Message": "Signup Successfull"}



@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):

    # CODE
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
    image: UploadFile = File(...),
    current_user: dict = Depends(create_token.get_current_user),
    db: Session = Depends(get_db)):

    # CODE
    if not image.content_type.startswith("image/"):
        return {"error": "Only Image files are Allowed"}

    file_path = os.path.join(UPLOAD_DIR, image.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    date = [datetime.now().strftime("%X"),datetime.now().strftime("%x")]
    feedback = run_automated_pipeline(file_path)

    new_data = AnalysisData(
        upload = file_path,
        analysis = feedback,
        createdAt = " ".join(date),
        userId = current_user['user_id'],
    )

    db.add(new_data)
    db.commit()
    db.refresh(new_data)

    return {
        "Feedback": feedback
    }



@app.get("/history")
def chatHistory(current_user: dict = Depends(create_token.get_current_user),
    db: Session = Depends(get_db)):

    # CODE
    user_id = int(current_user['user_id'])
    user_history = db.query(AnalysisData).filter(AnalysisData.userId == user_id).all()
    if not user_history:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user_history



@app.delete("/delete_history/{id}")
def delete_history(id: int, current_user: dict = Depends(create_token.get_current_user),
    db: Session = Depends(get_db)):
     
     user_id = int(current_user['user_id'])
     user_data = db.query(AnalysisData).filter(AnalysisData.userId == user_id, AnalysisData.id == id).first()

     if not user_data:
          raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data not found")

     db.delete(user_data)
     db.commit()

     return {"Message": "Deleted Successfully"}



@app.get('/profile')
def profile(current_user: dict = Depends(create_token.get_current_user),
            db: Session = Depends(get_db)):

            # CODE
            user_id = int(current_user['user_id'])
            user_profile = db.query(User).filter(User.id == user_id).first()

            if not user_profile:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

            data = ProfileSchema(
                 image=user_profile.image,
                 username=user_profile.username,
                 age=user_profile.age,
                 studentClass=user_profile.studentClass,
                 description=user_profile.description,
                 email=user_profile.email
            )
            return data



 
@app.put('/profile_update')
def profile(user: str = Form(...),current_user: dict = Depends(create_token.get_current_user),
            db: Session = Depends(get_db)):

            # CODE
            user = ProfileUpdateSchema.model_validate(json.loads(user))
        
            user_id = int(current_user['user_id'])
            user_profile = db.query(User).filter(User.id == user_id).first()

            if not user_profile:
                 raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User Not found")

            new_data = user.model_dump(exclude_unset=True)

            for key, value in new_data.items():
                 setattr(user_profile,key,value)

            db.commit()
            db.refresh(user_profile)
            
            return {"Updated successfully"}