import numpy as np
from app.models.model_loader import ModelLoader

class PredictionService:

    @staticmethod
    def predict_from_dict(data: dict):
        model = ModelLoader.get_model()
        scaler = ModelLoader.get_scaler()

        input_array = np.array([[
            data["pregnancies"],
            data["glucose"],
            data["blood_pressure"],
            data["skin_thickness"],
            data["insulin"],
            data["bmi"],
            data["diabetes_pedigree"],
            data["age"]
        ]])

        scaled_input = scaler.transform(input_array)
        probability = float(model.predict(scaled_input)[0][0])

        return {
            "prediction": "Diabetic" if probability >= 0.5 else "Non-Diabetic",
            "probability": round(probability, 4)
        }
