from sqlalchemy import Column,String,Integer,ForeignKey,VARCHAR
from database import Base

class User(Base):
    __tablename__= "users"

    id = Column(Integer, primary_key=True,autoincrement=True)
    username = Column(String(225))
    email = Column(String(225), unique=True)
    password = Column(String(225))

class AnalysisData(Base):
    __tablename__ = "userData"

    id = Column(Integer,primary_key=True)
    text = Column(String(225))
    upload = Column(String(225))
    analysis = Column(VARCHAR(10000))
    createdAt = Column(String(225))
    userId = Column(Integer,ForeignKey("users.id"))
