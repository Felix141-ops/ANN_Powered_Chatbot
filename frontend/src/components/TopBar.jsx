export default function TopBar({ onToggleSidebar }) {
  return (
    <header className="top-bar">
      <button
        className="menu-btn"
        aria-label="Toggle navigation"
        onClick={onToggleSidebar}
      >
        ☰
      </button>

      <h3>Diabetes Prediction Assistant</h3>

      <span className="badge">HIPAA Secure</span>
    </header>
  );
}

