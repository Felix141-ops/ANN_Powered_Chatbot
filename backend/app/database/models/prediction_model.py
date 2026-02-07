

from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey, Integer, Float, DateTime
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

    prediction = relationship("Prediction", back_populates="features", uselist=False)

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    result = Column(Integer, nullable=False) # 0 or 1
    probability = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    feature_id = Column(Integer, ForeignKey("features.id"), nullable=False)
    features = relationship("Features", back_populates="prediction") #used to define an explicit bidirectional relationship between two models.
