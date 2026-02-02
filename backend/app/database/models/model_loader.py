import joblib
from tensorflow.keras.models import load_model
from app.config import MODEL_PATH, SCALER_PATH

class ModelLoader:
    model = None
    scaler = None

    @classmethod
    def load(cls):
        if cls.model is None:
            cls.model = load_model(MODEL_PATH)
        if cls.scaler is None:
            cls.scaler = joblib.load(SCALER_PATH)

    @classmethod
    def get_model(cls):
        cls.load()
        return cls.model

    @classmethod
    def get_scaler(cls):
        cls.load()
        return cls.scaler
