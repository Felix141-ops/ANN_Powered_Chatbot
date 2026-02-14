from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict, chat, auth, history
from app.database.db import engine
from app.database.base import Base
from app.database.models import prediction_model

app = FastAPI(
    title="Diabetes ANN Chatbot API",
    version="1.0.0",
    description="ANN-powered diabetes prediction backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chatbot"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(history.router, prefix="/api/history", tags=["History"])

Base.metadata.create_all(bind=engine)

@app.get("/")
def health_check():
    return {"status": "Backend running"}
