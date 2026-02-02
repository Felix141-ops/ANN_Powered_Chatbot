from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import predict, chat

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

@app.get("/")
def health_check():
    return {"status": "Backend running"}
