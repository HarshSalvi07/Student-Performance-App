from pydantic import BaseModel,EmailStr
from typing import Literal

class RegisterSchema(BaseModel):
    image: str
    username: str
    age: int
    studentClass: str
    description: str
    email: EmailStr
    create_password: str
    confirm_password : str

class ProfileSchema(BaseModel):
    image: str
    username: str
    age: int
    studentClass: str
    description: str
    email: EmailStr

class ProfileUpdateSchema(BaseModel):
    username: str | None = None
    age: int | None = None
    description: str | None = None
    studentClass: str | None = None
    image: str | None = None