import { useEffect, useState } from "react";
import { fetchClinicalForm, submitPrediction } from "../services/api";
import Processing from "./Processing";

export default function ClinicalForm({ onPredictionSuccess }) {
  const [form, setForm] = useState(null);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClinicalForm()
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setError("Failed to load clinical form");
      });
  }, []);

  function handleChange(id, value) {
    // For number fields, validate that it's a valid number
    const field = form.fields.find(f => f.id === id);
    if (field && field.type === 'number') {
      // Allow empty values during typing
      if (value === '') {
        setValues(prev => ({ ...prev, [id]: value }));
        setError(null);
        return;
      }

      // Check if it's a valid number
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError(`${field.label} must be a valid number`);
        return;
      }

      // Check range
      if (numValue < field.min || numValue > field.max) {
        setError(`${field.label} must be between ${field.min} and ${field.max}`);
        return;
      }
    }

    setValues(prev => ({ ...prev, [id]: value }));
    setError(null); // Clear any previous errors
  }

  async function handleSubmit() {
    if (Object.keys(values).length !== form.fields.length) {
      setError("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Convert string values to numbers as expected by the API
      const numericValues = {};
      form.fields.forEach(field => {
        const value = values[field.id];
        if (field.type === 'number') {
          const numValue = parseFloat(value);
          if (isNaN(numValue)) {
            throw new Error(`${field.label} must be a valid number`);
          }
          numericValues[field.id] = numValue;
        } else {
          numericValues[field.id] = value;
        }
      });

      const result = await submitPrediction(numericValues);
      
      // Debug logging
      console.log('Raw API Response:', result);
      console.log('Response keys:', Object.keys(result));
      console.log('Response prediction:', result.prediction);
      console.log('Response message:', result.message);
      
      // Simplified and more robust response parsing
      let predictionData, message;
      
      try {
        // Check if we have the expected structure
        if (result && typeof result === 'object') {
          // Case 1: { prediction: { prediction, probability }, message }
          if (result.prediction && typeof result.prediction === 'object' && result.prediction.prediction) {
            predictionData = result.prediction;
            message = result.message || "Prediction completed successfully.";
          }
          // Case 2: { prediction, probability, message } - direct structure
          else if (result.prediction && result.probability) {
            predictionData = { prediction: result.prediction, probability: result.probability };
            message = result.message || "Prediction completed successfully.";
          }
          // Case 3: Just prediction object
          else if (result.prediction) {
            predictionData = { prediction: result.prediction, probability: 0.5 };
            message = result.message || "Prediction completed.";
          }
          // Case 4: Error response
          else if (result.error) {
            throw new Error(result.error);
          }
          // Case 5: Unknown structure - try to extract what we can
          else {
            console.warn('Unknown response structure, trying to extract data:', result);
            predictionData = { 
              prediction: result.prediction || 'Unknown', 
              probability: result.probability || 0.5 
            };
            message = result.message || "Prediction completed with unknown structure.";
          }
        } else {
          throw new Error("Response is not an object");
        }
        
        console.log('Successfully parsed prediction data:', predictionData);
        console.log('Message:', message);
        
      } catch (parseError) {
        console.error('Error parsing response:', parseError, result);
        throw new Error(`Failed to parse server response: ${parseError.message}`);
      }

      setPrediction({
        prediction: predictionData.prediction,
        probability: predictionData.probability,
        message: message
      });
      
      console.log('Processed prediction:', {
        prediction: predictionData.prediction,
        probability: predictionData.probability,
        message: message
      });

      // Call the callback to refresh sidebar history
      if (onPredictionSuccess) {
        onPredictionSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setValues({});
    setPrediction(null);
    setError(null);
  }

  if (loading) return <p>Loading clinical form…</p>;
  if (!form) return <p>Unable to load form.</p>;

  return (
    <div className="clinical-form-container">
      <div className="card">
        <div className="card-header">
          <h4>{form.title}</h4>
          <span className="tag">ANN Input Layer</span>
        </div>

        <p className="form-description">{form.description}</p>

        {error && <div className="error-message">{error}</div>}

        {submitting && (
          <div className="processing-overlay">
            <Processing />
          </div>
        )}

        <form className="clinical-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {form.fields.map(field => (
            <div className="form-group" key={field.id}>
              <label>
                {field.label}
                <span className="unit">({field.unit})</span>
              </label>

              <input
                type={field.type}
                min={field.min}
                max={field.max}
                step={field.step || "any"}
                value={values[field.id] || ""}
                onChange={e => handleChange(field.id, e.target.value)}
                required
                placeholder={`Enter ${field.label.toLowerCase()}`}
                disabled={submitting}
              />

              {field.step && field.step !== 1 && (
                <small className="field-help">
                  Accepts decimal values (e.g., {field.step === 0.1 ? '24.5' : field.step === 0.001 ? '0.547' : 'any decimal'})
                </small>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="submit-btn"
            disabled={Object.keys(values).length !== form.fields.length || submitting}
          >
            {submitting ? "Analyzing..." : "Submit for Analysis"}
          </button>
        </form>
      </div>

      {prediction && prediction.prediction && (
        <div className="card prediction-result">
          <div className="card-header">
            <h4>Prediction Results</h4>
            <span className="tag">ANN Output Layer</span>
          </div>

          <div className="prediction-content">
            <div className={`prediction-badge ${prediction.prediction.toLowerCase()}`}>
              {prediction.prediction}
            </div>

            <div className="probability-display">
              <div className="probability-bar">
                <div
                  className="probability-fill"
                  style={{ width: `${prediction.probability * 100}%` }}
                ></div>
              </div>
              <span className="probability-text">
                {(prediction.probability * 100).toFixed(1)}% probability
              </span>
            </div>

            <div className="prediction-message">
              {prediction.message.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            <button onClick={resetForm} className="reset-btn">
              New Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
