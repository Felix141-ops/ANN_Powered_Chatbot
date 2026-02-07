from typing import Any
from fastapi import APIRouter, Depends
from app.chatbot.flow_manager import FormFlowManager
from app.chatbot.response_generator import ResponseGenerator
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.services.prediction_service import PredictionService
from app.schemas.patient import PatientInput


router = APIRouter()
flow = FormFlowManager()

@router.get("/form")
def get_form():
    return {
        "title": "Clinical Diabetes Assessment",
        "description": "Please fill in all required patient clinical parameters.",
        "fields": flow.get_form()
    }
@router.post("/submit/{field_id}")
def submit_field(field_id: str, value: Any):
    success = flow.submit_field(field_id, value)
    if not success:
        return {"error": flow.errors.get(field_id, "Invalid submission")}
    
    progress = flow.get_progress()
    return {
        "success": True,
        "progress": progress,
        "next_field": progress["next_field"]
    }

@router.get("/progress")
def get_progress():
    return flow.get_progress()

@router.post("/predict")
def make_prediction(patient: PatientInput, db: Session = Depends(get_db)):
    """
    Accept form data directly and make a prediction.
    This endpoint receives patient data and returns prediction with message.
    """
    result = PredictionService.predict_from_dict(patient, db)
    response = ResponseGenerator.generate_response(result)
    
    final_response = {
        "prediction": result.prediction,
        "probability": result.probability,
        "message": response
    }
    
    return final_response