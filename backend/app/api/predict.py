from fastapi import APIRouter
from app.services.prediction_service import PredictionService

router = APIRouter()

@router.post("/form")
def predict_from_form(payload: dict):
    return PredictionService.predict_from_dict(payload)
