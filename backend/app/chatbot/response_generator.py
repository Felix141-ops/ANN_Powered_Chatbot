from app.schemas.patient import PredictionResponse

class ResponseGenerator:
    
    @staticmethod
    def generate_response(prediction_response: PredictionResponse) -> str:
        """
        Generate a human-friendly response based on the diabetes prediction result.
        """
        prediction = prediction_response.prediction
        probability = prediction_response.probability
        
        if prediction == "Diabetic":
            return ResponseGenerator._generate_diabetic_response(probability)
        else:
            return ResponseGenerator._generate_non_diabetic_response(probability)
    
    @staticmethod
    def _generate_diabetic_response(probability: float) -> str:
        """
        Generate response for diabetic prediction.
        """
        confidence = "high" if probability > 0.7 else "moderate" if probability > 0.6 else "low"
        
        response = f"Based on your health data, our AI model predicts that you may have diabetes with a {confidence} confidence level "
        response += f"(probability: {probability:.1%}).\n\n"
        response += "⚠️ **Important:** This is not a medical diagnosis. Please consult a healthcare professional immediately for proper testing and evaluation.\n\n"
        response += "In the meantime, consider:\n"
        response += "• Monitoring your blood sugar levels regularly\n"
        response += "• Maintaining a healthy diet and exercise routine\n"
        response += "• Scheduling an appointment with your doctor\n\n"
        response += "Early detection and management are key to controlling diabetes."
        
        return response
    
    @staticmethod
    def _generate_non_diabetic_response(probability: float) -> str:
        """
        Generate response for non-diabetic prediction.
        """
        confidence = "high" if probability < 0.3 else "moderate" if probability < 0.4 else "low"
        
        response = f"Great news! Based on your health data, our AI model predicts that you are likely non-diabetic with {confidence} confidence "
        response += f"(probability of diabetes: {probability:.1%}).\n\n"
        response += "However, maintaining good health habits is still important:\n"
        response += "• Continue regular health check-ups\n"
        response += "• Maintain a balanced diet and active lifestyle\n"
        response += "• Monitor your health metrics periodically\n\n"
        response += "Prevention is always better than cure. Keep up the good work!"
        
        return response
