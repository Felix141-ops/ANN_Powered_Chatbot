# app/models/prediction.model.py

from sqlalchemy import Column, Integer, Float, DateTime
from datetime import datetime
from app.database.base import Base

class Features(Base):
    __tablename__ = "features"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    glucose = Column(Float, nullable=False)
    bmi = Column(Float, nullable=False)
    insulin = Column(Float, nullable=False)
    skin_thickness = Column(Float, nullable=False)
    diabetes_pedigree = Column(Float, nullable=False)
    blood_pressure = Column(Float, nullable=False)
    pregnancies = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    feature_id = Column(Integer, nullable=False)
    prediction_result = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)