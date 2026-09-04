from database import Base, engine
from models import User,AnalysisData

Base.metadata.create_all(bind=engine)