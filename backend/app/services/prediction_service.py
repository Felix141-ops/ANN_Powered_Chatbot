import numpy as np
from sqlalchemy.orm import Session

from app.database.models.prediction_model import Features, Prediction
from app.schemas.patient import PatientInput, PredictionResponse
from app.database.models.model_loader import ModelLoader


class PredictionService:
    
    @staticmethod
    def predict_from_dict(data: PatientInput, db: Session) -> PredictionResponse:
        """
        Save patient features to the database, perform prediction using the trained model,
        save the prediction result, and return the prediction response.
        """
        # Save features to the database
        features = Features(
            pregnancies=data.pregnancies,
            glucose=data.glucose,
            blood_pressure=data.blood_pressure,
            skin_thickness=data.skin_thickness,
            insulin=data.insulin,
            bmi=data.bmi,
            diabetes_pedigree=data.diabetes_pedigree,
            age=data.age
        )
        
        db.add(features)
        db.commit()
        db.refresh(features)
        
        # Load model and scaler from saved_models folder
        model = ModelLoader.get_model()
        scaler = ModelLoader.get_scaler()
        
        # Prepare input array for prediction
        input_array = np.array([[
            data.pregnancies,
            data.glucose,
            data.blood_pressure,
            data.skin_thickness,
            data.insulin,
            data.bmi,
            data.diabetes_pedigree,
            data.age
        ]])
        
        # Scale and predict
        scaled_input = scaler.transform(input_array)
        probability = float(model.predict(scaled_input)[0][0])
        prediction_result = 1 if probability >= 0.5 else 0
        
        # Save prediction to the database
        prediction = Prediction(
            result=prediction_result,
            probability=probability,
            feature_id=features.id
        )
        
        db.add(prediction)
        db.commit()
        
        # Return prediction response
        return PredictionResponse(
            prediction="Diabetic" if prediction_result == 1 else "Non-Diabetic",
            probability=round(probability, 4)
        )
