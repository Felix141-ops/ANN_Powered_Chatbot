import { useNavigate } from "react-router-dom";

export default function TopBar({ onToggleSidebar }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("logout: started");

    try {
      // clear client-side auth
      localStorage.removeItem("token");
      console.log("logout: token removed from localStorage");

      // notify backend (stateless JWT—this is optional)
      const res = await fetch("http://localhost:8000/api/auth/logout", { method: "POST" });
      console.log("logout: backend responded", res.status);
    } catch (err) {
      // log error but continue with client-side logout
      console.error("logout: error during logout request", err);
    } finally {
      // redirect to signin regardless
      console.log("logout: navigating to /signin");
      navigate("/signin");
    }
  };

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

      <button className="primary-btn" onClick={handleLogout} aria-label="Sign out">
        Sign Out
      </button>
    </header>
  );
}

