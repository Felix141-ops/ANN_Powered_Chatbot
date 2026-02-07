const API_BASE = "http://localhost:8000/api";

export async function fetchClinicalForm() {
  const res = await fetch(`${API_BASE}/chat/form`);
  if (!res.ok) throw new Error("Failed to load form");
  return res.json();
}

export async function submitPrediction(formData) {
  try {
    const res = await fetch(`${API_BASE}/chat/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch {
        // If not JSON, use the raw text
        if (errorText) errorMessage = errorText;
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}
