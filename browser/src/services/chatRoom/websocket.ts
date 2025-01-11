import type { Message } from "../../types/types";

export const createWebSocket = (
  wsUrl: string,
  onMessage: (message: Message) => void,
  setIsReady: (isReady: boolean) => void
): WebSocket => {
  console.log("Attempting connection to WebSocket");
  const socket = new WebSocket(wsUrl);
  socket.onopen = function (event) {
    console.log("Connected to WebSocket");
    setIsReady(true);
  };
  socket.onmessage = function (event) {
    const newMessage: Message = JSON.parse(event.data);
    console.log("Received message:", newMessage);
    onMessage(newMessage);
  };
  socket.onclose = function (event) {
    console.log("Disconnected from WebSocket");
    setIsReady(false);
  };
  return socket;
};
