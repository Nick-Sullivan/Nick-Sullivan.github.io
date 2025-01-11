import React from "react";
import { NameInput } from "../NameInput/NameInput";
import "./RoomHeader.css";

export const RoomHeader: React.FC<{
  roomId: string;
  defaultName: string;
  onNameChange: (value: string) => void;
}> = ({ roomId, defaultName, onNameChange }) => {
  return (
    <div className="room-header">
      <h1>Room {roomId}</h1>
      Your name is&nbsp;
      <NameInput defaultValue={defaultName} onValueCommitted={onNameChange} />
    </div>
  );
};
