from typing import Any
from fastapi import APIRouter, Depends, Header, HTTPException
from app.chatbot.flow_manager import FormFlowManager
from app.chatbot.response_generator import ResponseGenerator
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.services.prediction_service import PredictionService
from app.core.security import decode_token
from app.database.models.user import User
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
def make_prediction(patient: PatientInput, db: Session = Depends(get_db), authorization: str | None = Header(None)):
    """
    Accept form data directly and make a prediction.
    This endpoint receives patient data and returns prediction with message.
    """
    user_id = None
    if authorization:
        try:
            scheme, token = authorization.split()
            payload = decode_token(token)
            user_id = int(payload.get("sub"))
            print(f"DEBUG: Decoded token, user_id={user_id}")
        except Exception as e:
            print(f"DEBUG: Token decode error: {e}")
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    else:
        print("DEBUG: No authorization header")

    print(f"DEBUG: Calling predict_from_dict with user_id={user_id}")
    result = PredictionService.predict_from_dict(patient, db, user_id=user_id)
    response = ResponseGenerator.generate_response(result)
    
    final_response = {
        "prediction": result.prediction,
        "probability": result.probability,
        "message": response
    }
    
    return final_response