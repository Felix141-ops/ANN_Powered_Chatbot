import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AssistantMessage from "../components/AssistantMessage";
import ClinicalForm from "../components/ClinicalForm";
import Processing from "../components/Processing";
import ChatInput from "../components/ChatInput";

export default function Chatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const handlePredictionSuccess = () => {
    // Refetch history in sidebar after a successful prediction
    if (sidebarRef.current) {
      sidebarRef.current.refetchHistory();
    }
  };

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar ref={sidebarRef} onClose={() => setSidebarOpen(false)} />

      <main className="main">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <AssistantMessage />
        <ClinicalForm onPredictionSuccess={handlePredictionSuccess} />
        <Processing />
        <ChatInput />

        <footer className="footer">
          <span>Validated Model: ANN-PIMA-v2</span>
          <span>Confidence Interval: 98.4%</span>
        </footer>
      </main>
    </div>
  );
}
