import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import AssistantMessage from "./components/AssistantMessage";
import ClinicalForm from "./components/ClinicalForm";
import Processing from "./components/Processing";
import ChatInput from "./components/ChatInput";

export default function App() {
   const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar onClose={() => setSidebarOpen(false)} />

      <main className="main">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <AssistantMessage />
        <ClinicalForm />
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
