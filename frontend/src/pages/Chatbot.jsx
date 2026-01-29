import ChatWindow from "../components/Sidebar";
import "../styles/chatbot.css";

const Chatbot = () => {
  return (
    <div className="chatbot-container">
      <h2>Diabetes Prediction Chatbot</h2>
      <ChatWindow />
    </div>
  );
};

export default Chatbot;
