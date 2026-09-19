from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
    BackgroundTasks
)
from schema import RegisterSchema, ProfileSchema, ProfileUpdateSchema
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from utils import create_token, hass_password
from fastapi.staticfiles import StaticFiles
from main import run_automated_pipeline
from models import users_collection, analysis_collection
from database import db
from bson import ObjectId
from datetime import datetime
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

app.mount(
    "/uploads",
    StaticFiles(directory=UPLOAD_DIR),
    name="uploads"
)



@app.post("/register")
def register(
    user: str = Form(...),
    image: UploadFile = File(...)
):

    user = RegisterSchema.model_validate(
        json.loads(user)
    )

    # Check if email already exists
    user_exist = users_collection.find_one({
        "email": user.email
    })

    if user_exist:
        raise HTTPException(
            status_code=status.HTTP_302_FOUND,
            detail="User Already Exist"
        )

    # Check passwords
    if user.create_password != user.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="password not match"
        )

    # Save image
    file_path = os.path.join(
        UPLOAD_DIR,
        image.filename
    )

    contents = image.file.read() 

    with open(file_path, "wb") as f:
        f.write(contents)

    # Hash password
    hashed_password = hass_password.hashpassword(
        user.confirm_password
    )

    # Create MongoDB document
    new_user = {
        "image": file_path,
        "username": user.username,
        "age": user.age,
        "studentClass": user.studentClass,
        "description": user.description,
        "email": str(user.email),
        "password": hashed_password
    }

    # Insert into MongoDB
    result = users_collection.insert_one(new_user)
    print("================================")
    print("USER INSERTED")
    print("ID:", result.inserted_id)
    print("DATABASE:", db.name)
    print("USERS COUNT:", users_collection.count_documents({}))
    print("================================")

    return {
        "Message": "Signup Successfull"
    }


# =========================================================
# LOGIN
# =========================================================

@app.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):

    # Find user by username
    user_exist = users_collection.find_one({
        "username": form_data.username
    })

    if not user_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User Not Found"
        )

    # Verify password
    if not hass_password.verifyPassword(
        form_data.password,
        user_exist["password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Credential"
        )

    # MongoDB ObjectId -> string
    token_data = {
        "sub": str(user_exist["_id"])
    }

    token = create_token.create_token(
        token_data
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# =========================================================
# BACKGROUND AI PROCESS
# =========================================================

def process_analysis(
    file_path: str,
    user_id: str,
    analysis_id: str,
    subject: str
):

    try:

        print("Running AI pipeline...")

        feedback = run_automated_pipeline(
            image_path=file_path,
            subject=subject
        )

        print("AI PIPELINE COMPLETED")
        print("Feedback length:", len(feedback))

        result = analysis_collection.update_one(
            {
                "_id": ObjectId(analysis_id),
                "userId": ObjectId(user_id)
            },
            {
                "$set": {
                    "analysis": feedback,
                    "status": "completed"
                }
            }
        )

        if result.matched_count > 0:

            print("DATABASE UPDATED SUCCESSFULLY")
            print("Status: completed")

        else:

            print(
                "ANALYSIS NOT FOUND:",
                analysis_id
            )

    except Exception as e:

        print("Analysis failed:", str(e))

        try:

            analysis_collection.update_one(
                {
                    "_id": ObjectId(analysis_id),
                    "userId": ObjectId(user_id)
                },
                {
                    "$set": {
                        "status": "failed"
                    }
                }
            )

        except Exception as update_error:

            print(
                "Could not update failed status:",
                str(update_error)
            )



@app.post("/dashboard")
async def dashboard(
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    subject: str = Form(...),
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    if not image.content_type.startswith("image/"):

        return {
            "error": "Only Image files are Allowed"
        }

    # Make sure subject isn't empty
    subject = subject.strip()

    if not subject:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Subject cannot be empty"
        )

    # Save uploaded image
    file_path = os.path.join(
        UPLOAD_DIR,
        image.filename
    )

    with open(file_path, "wb") as buffer:

        shutil.copyfileobj(
            image.file,
            buffer
        )

    # Current date/time
    created_at = datetime.now().strftime(
        "%X %x"
    )

    # MongoDB user ID
    user_id = current_user["user_id"]

    # Create analysis document
    new_data = {
        "upload": file_path,
        "analysis": "",
        "createdAt": created_at,
        "userId": ObjectId(user_id),
        "subject": subject,
        "status": "processing"
    }

    # Insert analysis into MongoDB
    result = analysis_collection.insert_one(
        new_data
    )

    analysis_id = result.inserted_id

    # Start AI processing
    background_tasks.add_task(
        process_analysis,
        file_path,
        user_id,
        str(analysis_id),
        subject
    )

    return {
        "id": str(analysis_id),
        "status": "processing",
        "message": "Analysis started"
    }

# =========================================================
# GET ANALYSIS
# =========================================================

@app.get("/analysis/{analysis_id}")
def get_analysis(
    analysis_id: str,
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    try:

        analysis = analysis_collection.find_one(
            {
                "_id": ObjectId(analysis_id),

                "userId": ObjectId(
                    current_user["user_id"]
                )
            }
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid analysis ID"
        )

    if not analysis:

        raise HTTPException(
            status_code=404,
            detail="Analysis not found"
        )

    return {

        "id": str(analysis["_id"]),

        "status": analysis["status"],

        "analysis": analysis["analysis"]
    }


# =========================================================
# HISTORY
# =========================================================

@app.get("/history")
def chatHistory(
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    user_id = ObjectId(
        current_user["user_id"]
    )

    user_history = list(
        analysis_collection.find(
            {
                "userId": user_id
            }
        ).sort(
            "_id",
            -1
        )
    )

    if not user_history:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Convert MongoDB ObjectId to string
    for item in user_history:

        item["id"] = str(
            item["_id"]
        )

        del item["_id"]

        item["userId"] = str(
            item["userId"]
        )

    return user_history


# =========================================================
# DELETE HISTORY
# =========================================================

@app.delete("/delete_history/{id}")
def delete_history(
    id: str,
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    try:

        result = analysis_collection.delete_one(
            {
                "_id": ObjectId(id),

                "userId": ObjectId(
                    current_user["user_id"]
                )
            }
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid analysis ID"
        )

    if result.deleted_count == 0:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data not found"
        )

    return {
        "Message": "Deleted Successfully"
    }


# =========================================================
# PROFILE
# =========================================================

@app.get("/profile")
def profile(
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    try:

        user_id = ObjectId(
            current_user["user_id"]
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user_profile = users_collection.find_one(
        {
            "_id": user_id
        }
    )

    if not user_profile:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    data = ProfileSchema(

        image=user_profile.get(
            "image",
            ""
        ),

        username=user_profile.get(
            "username",
            ""
        ),

        age=user_profile.get(
            "age",
            0
        ),

        studentClass=user_profile.get(
            "studentClass",
            ""
        ),

        description=user_profile.get(
            "description",
            ""
        ),

        email=user_profile.get(
            "email",
            ""
        )
    )

    return data


# =========================================================
# PROFILE UPDATE
# =========================================================

@app.put("/profile_update")
async def profile_update(
    user: str = Form(...),
    image: UploadFile | None = File(None),
    current_user: dict = Depends(
        create_token.get_current_user
    )
):

    user = ProfileUpdateSchema.model_validate(
        json.loads(user)
    )

    try:

        user_id = ObjectId(
            current_user["user_id"]
        )

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid user ID"
        )

    user_profile = users_collection.find_one(
        {
            "_id": user_id
        }
    )

    if not user_profile:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Text fields
    new_data = user.model_dump(
        exclude_unset=True
    )

    # Don't put None values into MongoDB
    new_data = {
        key: value
        for key, value in new_data.items()
        if value is not None
    }

    # Update image if selected
    if image:

        file_path = os.path.join(
            UPLOAD_DIR,
            image.filename
        )

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                image.file,
                buffer
            )

        new_data["image"] = file_path

    # Update MongoDB
    if new_data:

        users_collection.update_one(
            {
                "_id": user_id
            },
            {
                "$set": new_data
            }
        )

    # Get updated profile
    updated_user = users_collection.find_one(
        {
            "_id": user_id
        }
    )

    return {

        "image": updated_user.get(
            "image",
            ""
        ),

        "username": updated_user.get(
            "username",
            ""
        ),

        "age": updated_user.get(
            "age",
            0
        ),

        "studentClass": updated_user.get(
            "studentClass",
            ""
        ),

        "description": updated_user.get(
            "description",
            ""
        )
    }