from fastapi import APIRouter, Depends, Header, HTTPException
from app.chatbot.response_generator import ResponseGenerator
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.services.prediction_service import PredictionService
from app.core.security import decode_token
from app.database.models.user import User
from app.schemas.patient import PatientInput


router = APIRouter()

@router.post("/predict")
def make_prediction(patient: PatientInput, db: Session = Depends(get_db), authorization: str | None = Header(None)):
    """
    Accept user data directly and make a prediction.
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