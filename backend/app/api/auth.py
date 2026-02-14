from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.database.dependencies import get_db
from app.schemas.user import UserCreate, UserLogin, UserOut, Token
from app.database.models.user import User
from app.core.security import get_password_hash, verify_password, create_access_token
from app.database.models.prediction_model import Prediction
from app.database.models.token_blacklist import TokenBlacklist

router = APIRouter()


@router.post("/register", response_model=UserOut)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    user = User(username=user_in.username, email=user_in.email, hashed_password=get_password_hash(user_in.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_in.username).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    token = create_access_token({"sub": str(user.id), "username": user.username})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/logout")
def logout(authorization: str | None = Header(None), db: Session = Depends(get_db)):
    if authorization:
        try:
            scheme, token = authorization.split()
        except Exception:
            return {"msg": "invalid authorization header"}
        db.add(TokenBlacklist(token=token))
        db.commit()
    localStorage_action = "client removes token"  # client still must remove token
    return {"msg": "logout success"}
