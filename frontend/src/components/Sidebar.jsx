
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

const Sidebar = forwardRef(({ onClose }, ref) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("fetchHistory: token exists?", !!token);
      if (!token) {
        console.log("fetchHistory: no token, returning");
        setLoading(false);
        return;
      }

      console.log("fetchHistory: sending request to /api/history");
      const res = await fetch("http://localhost:8000/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("fetchHistory: response status", res.status);
      if (!res.ok) {
        const text = await res.text();
        console.log("fetchHistory: error response", text);
        throw new Error(`Failed to fetch history: ${res.status}`);
      }

      const data = await res.json();
      console.log("fetchHistory: data received", data);
      setPredictions(data.predictions || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Expose refetch method via ref
  useImperativeHandle(ref, () => ({
    refetchHistory: fetchHistory,
  }));

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <aside className="sidebar">
      <button className="close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>

      <div className="logo">
        <h2>DiabetesPredict AI</h2>
        <span>Clinical Engine v4.1</span>
      </div>

      <button className="primary-btn">+ New Assessment</button>

      <div className="section">
        <h4>Recent Assessments</h4>
        {loading && <p style={{ fontSize: "0.9rem", color: "#999" }}>Loading...</p>}
        {/*{error && <p style={{ fontSize: "0.9rem", color: "#d32f2f" }}>Error: {error}</p>} */} 
        {!loading && predictions.length === 0 && (
          <p style={{ fontSize: "0.9rem", color: "#999" }}>No assessments yet</p>
        )}
        {predictions.map((pred) => (
          <div key={pred.id} className="assessment">
            <strong>Prediction Result: {pred.result ? "Positive" : "Negative"}</strong>
            <small>
              Probability: {(pred.probability * 100).toFixed(1)}% · {formatDate(pred.created_at)}
            </small>
          </div>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
export default Sidebar;

