import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState(null);

  const send = async () => {
    if (!value.trim()) return;
    if (!onSend) return;

    const res = await onSend(value);
    if (res && res.accepted) {
      setValue("");
      setLocalError(null);
    } else if (res && res.error) {
      setLocalError(res.error);
    }
  };

  return (
    <div className="chat-input">
      <input
        placeholder="Type your answer and press Enter"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
        disabled={disabled}
      />
      <button onClick={send} disabled={disabled}>➤</button>
      {localError && <div className="input-error">{localError}</div>}
    </div>
  );
}
