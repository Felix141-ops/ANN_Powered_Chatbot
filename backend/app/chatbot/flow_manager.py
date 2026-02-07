from typing import Any
from app.chatbot.form_definition import FORM_FIELDS


class FormFlowManager:
    # Uses a dictionary `self.responses` to store user inputs for each form field
    def __init__(self):
        self.responses = {}
        self.errors = {}

    def get_form(self):
        return FORM_FIELDS

    def submit_field(self, field_id: str, value: Any) -> bool:
        """Validate and submit field with type checking"""
        field_def = self._get_field_definition(field_id)
        if not field_def:
            return False
            
        # Type validation
        if field_def["type"] == "number":
            try:
                num_value = float(value)
                if num_value < field_def.get("min", 0) or num_value > field_def.get("max", float('inf')):
                    self.errors[field_id] = f"Value must be between {field_def['min']} and {field_def['max']}"
                    return False
                self.responses[field_id] = num_value
            except ValueError:
                self.errors[field_id] = "Must be a valid number"
                return False
        else:
            self.responses[field_id] = value
            
        # Clear error if validation passes
        self.errors.pop(field_id, None)
        return True
    
    def get_progress(self) -> dict:
        """Return completion progress and next required field"""
        completed = len(self.responses)
        total = len(FORM_FIELDS)
        percentage = (completed / total * 100) if total > 0 else 0
    
        next_field = None
        for field in FORM_FIELDS:
            if field["id"] not in self.responses:
                next_field = field
                break
    
        return {
            "completed": completed,
            "total": total,
            "percentage": round(percentage, 1),
            "next_field": next_field,
            "is_complete": self.is_complete()
        }
    
    def is_complete(self):
        return len(self.responses) == len(FORM_FIELDS)
    
    def reset(self):
        """Clear all responses and start fresh"""
        self.responses = {}
        self.errors = {}

    def get_missing_fields(self) -> list:
        """Return list of field IDs that still need to be filled"""
        return [field["id"] for field in FORM_FIELDS if field["id"] not in self.responses]
    
    def get_prediction_payload(self) -> dict:
        """Return validated payload ready for prediction service"""
        if not self.is_complete():
            raise ValueError("Form is not complete")
    
        # Convert to PatientInput format
        return {
            "pregnancies": int(self.responses["pregnancies"]),
            "glucose": float(self.responses["glucose"]),
            "blood_pressure": float(self.responses["blood_pressure"]),
            "skin_thickness": float(self.responses["skin_thickness"]),
            "insulin": float(self.responses["insulin"]),
            "bmi": float(self.responses["bmi"]),
            "diabetes_pedigree": float(self.responses["diabetes_pedigree"]),
            "age": int(self.responses["age"])
    }
    
    def get_field_status(self, field_id: str) -> dict:
        """Get status of a specific field"""
        field_def = self._get_field_definition(field_id)
        if not field_def:
            return {"error": "Field not found"}
    
        return {
            "id": field_id,
            "label": field_def["label"],
            "value": self.responses.get(field_id),
            "has_value": field_id in self.responses,
            "error": self.errors.get(field_id),
            "required": True  # All fields are required
    }

    def _get_field_definition(self, field_id: str) -> dict:
        """Helper to get field definition by ID"""
        return next((field for field in FORM_FIELDS if field["id"] == field_id), None)
    def get_payload(self):
        return self.responses
