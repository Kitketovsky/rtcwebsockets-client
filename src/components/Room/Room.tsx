import React from "react";

interface Props {
  id: string;
  onJoinRoom: (id: string) => void;
}
export const Room: React.FC<Props> = ({ id, onJoinRoom }) => {
  return (
    <div>
      <span>Name: {id.slice(5)}</span>
      <button onClick={() => onJoinRoom(id)}>Join</button>
    </div>
  );
};
