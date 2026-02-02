from pydantic import BaseModel, Field

class PatientInput(BaseModel):
    pregnancies: int = Field(..., ge=0)
    glucose: float = Field(..., gt=0)
    blood_pressure: float = Field(..., gt=0)
    skin_thickness: float = Field(..., ge=0)
    insulin: float = Field(..., ge=0)
    bmi: float = Field(..., gt=0)
    diabetes_pedigree: float = Field(..., ge=0)
    age: int = Field(..., gt=0)

class PredictionResponse(BaseModel):
    probability: float
    prediction: str
