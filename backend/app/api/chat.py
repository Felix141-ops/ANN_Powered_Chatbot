from fastapi import APIRouter
from app.chatbot.flow_manager import FormFlowManager

router = APIRouter()
flow = FormFlowManager()

@router.get("/form")
def get_form():
    return {
        "title": "Clinical Diabetes Assessment",
        "description": "Please fill in all required patient clinical parameters.",
        "fields": flow.get_form()
    }
