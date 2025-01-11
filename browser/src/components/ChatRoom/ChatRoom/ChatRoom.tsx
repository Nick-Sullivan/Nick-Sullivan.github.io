import React, { useState, useEffect } from "react";
import { MessageInput } from "../MessageInput/MessageInput";
import { MessageView } from "../MessageView/MessageView";
import { RoomHeader } from "../RoomHeader/RoomHeader";
import type { Message } from "../../../types/types";
import { createWebSocket } from "../../../services/chatRoom/websocket";
import { generateRandomName } from "../../../services/chatRoom/random";
import "./ChatRoom.css";

const ChatRoom: React.FC<{
  roomId: string;
  wsUrl: string;
}> = ({ roomId, wsUrl }) => {
  const [name, setName] = useState(generateRandomName());
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  const onMessage = (newMessage: Message) => {
    setMessages((prevMessages) => {
      return [...prevMessages, newMessage];
    });
  };
  useEffect(() => {
    const newSocket = createWebSocket(wsUrl, onMessage, setIsSocketReady);
    setSocket(newSocket);
    return () => {
      newSocket.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    if (socket === null || !isSocketReady) {
      return;
    }
    console.log(`RoomId:${roomId}`);
    console.log(`Name:${name}`);
    socket.send(`UserUpdate:RoomId=${roomId}&Name=${name}`);
  }, [isSocketReady, name]);

  const handleSendMessage = (message: string) => {
    if (socket === null || !isSocketReady) {
      return;
    }
    socket.send(message);
  };

  return (
    <div className="room">
      <RoomHeader roomId={roomId} defaultName={name} onNameChange={setName} />
      <MessageView isEnabled={isSocketReady} messages={messages} />
      <MessageInput isEnabled={isSocketReady} onSend={handleSendMessage} />
    </div>
  );
};

export default ChatRoom;
