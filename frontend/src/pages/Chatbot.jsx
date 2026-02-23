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
      const badgeClass = m.isDiabetic ? "diabetic" : "non-diabetic";
      const predictionText = m.isDiabetic ? "Diabetic" : "Non-Diabetic";
      
      return (
        <div key={idx} className="chat-bubble bot" style={{ alignSelf: "stretch", maxWidth: "100%" }}>
          <div className="prediction-message-container">
            <div className="prediction-header">
              <div className={`prediction-status-badge ${badgeClass}`}>
                {predictionText}
              </div>
              <div className="prediction-confidence">
                Confidence: {m.probability}%
              </div>
            </div>
            
            <div className="prediction-body">
              {m.message.split('\n\n').map((paragraph, pIdx) => {
                // Handle warning sections
                if (paragraph.includes('⚠️')) {
                  return (
                    <div key={pIdx} className="warning-section">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <div key={lIdx}>{line}</div>
                      ))}
                    </div>
                  );
                }
                
                // Handle success sections for non-diabetic
                if (m.isDiabetic === false && paragraph.includes('Great news')) {
                  return (
                    <div key={pIdx} className="success-section">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <div key={lIdx}>{line}</div>
                      ))}
                    </div>
                  );
                }
                
                // Handle recommendation lists
                if (paragraph.includes('•')) {
                  const recommendations = paragraph.split('\n').filter(line => line.includes('•'));
                  return (
                    <div key={pIdx}>
                      <p>{paragraph.split('\n').find(line => !line.includes('•'))}</p>
                      <ul className="recommendations-list">
                        {recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec.replace('•', '').trim()}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                
                return <p key={pIdx}>{paragraph}</p>;
              })}
            </div>
            
            <div className="prediction-footer">
              Analysis complete • Based on clinical parameters
            </div>
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
