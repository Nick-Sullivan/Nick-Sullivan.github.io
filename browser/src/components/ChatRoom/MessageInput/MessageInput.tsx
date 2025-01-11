import React, { useState } from "react";
import "./MessageInput.css";

export const MessageInput: React.FC<{
  isEnabled: boolean;
  onSend: (message: string) => void;
}> = ({ isEnabled, onSend }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message && isEnabled) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <div className="message-container">
      <input
        type="text"
        className="message-input"
        placeholder="Type your message..."
        maxLength={100}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
      />
      <button
        className="message-button"
        onClick={handleSendMessage}
        disabled={!isEnabled}
      >
        Send
      </button>
    </div>
  );
};
