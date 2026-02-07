from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.patient import PatientInput,PredictionResponse
from app.services.prediction_service import PredictionService

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/", response_model=PredictionResponse)
def predict(
    patient: PatientInput,
    db: Session = Depends(get_db)
    ):
    return PredictionService.predict_from_dict(patient, db)