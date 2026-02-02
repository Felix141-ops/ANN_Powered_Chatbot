import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "saved_models", "ann_diabetes_model.h5")
SCALER_PATH = os.path.join(BASE_DIR, "saved_models", "scaler.pkl")
