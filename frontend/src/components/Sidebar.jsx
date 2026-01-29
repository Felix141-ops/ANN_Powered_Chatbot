
export default function Sidebar({ onClose }) {
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
        <div className="assessment active">
          <strong>Patient Case #8812</strong>
          <small>Completed · Today</small>
        </div>
        <div className="assessment">
          <strong>Annual Screening Update</strong>
          <small>Oct 24, 2023</small>
        </div>
      </div>

    </aside>
  );
}

