from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db
from app.database.models.user import User
from app.database.models.prediction_model import Prediction, Features
from app.core.security import decode_token
from fastapi import Header

router = APIRouter()


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        scheme, token = authorization.split()
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@router.get("/history")
def get_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    preds = (
        db.query(Prediction)
        .filter(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    results = []
    for p in preds:
        features = db.query(Features).filter(Features.id == p.feature_id).first()
        results.append({
            "id": p.id,
            "result": p.result,
            "probability": p.probability,
            "created_at": p.created_at.isoformat(),
            "features": {
                "pregnancies": features.pregnancies,
                "glucose": features.glucose,
                "blood_pressure": features.blood_pressure,
                "skin_thickness": features.skin_thickness,
                "insulin": features.insulin,
                "bmi": features.bmi,
                "diabetes_pedigree": features.diabetes_pedigree,
                "age": features.age,
            }
        })

    return {"predictions": results}
