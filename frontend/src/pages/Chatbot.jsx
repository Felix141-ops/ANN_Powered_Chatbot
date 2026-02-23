import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AssistantMessage from "../components/AssistantMessage";
import ChatInput from "../components/ChatInput";
import { useChat } from "../hooks/useChat";

export default function Chatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const chatEndRef = useRef(null);

  const { messages, handleUserInput, loading } = useChat();

  // 🔹 Auto scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderMessage = (m, idx) => {
    // 🔹 Prediction Message Rendering
    if (m.type === "prediction") {
      return (
        <div key={idx} className="chat-bubble prediction">
          <div className="prediction-card">
            {typeof m.text === "object" ? (
              <>
                <h3>{m.text.prediction}</h3>
                <p>
                  Confidence: {(m.text.probability * 100).toFixed(1)}%
                </p>
                {m.text.message && <p>{m.text.message}</p>}
              </>
            ) : (
              <div>{m.text}</div>
            )}
          </div>
        </div>
      );
    }

    // 🔹 Normal Messages
    return (
      <div
        key={idx}
        className={`chat-bubble ${
          m.sender === "bot" ? "bot" : "user"
        }`}
      >
        <div className="message-content">{m.text}</div>
      </div>
    );
  };

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar ref={sidebarRef} onClose={() => setSidebarOpen(false)} />

      <main className="main">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <AssistantMessage />

        <div className="chat-container">
          {messages.map((m, idx) => renderMessage(m, idx))}
          <div ref={chatEndRef} />
        </div>

        <ChatInput onSend={handleUserInput} disabled={loading} />

        <footer className="footer">
          <span>Validated Model: ANN-PIMA-v2</span>
          <span>Confidence Interval: 98.4%</span>
        </footer>
      </main>
    </div>
  );
}
