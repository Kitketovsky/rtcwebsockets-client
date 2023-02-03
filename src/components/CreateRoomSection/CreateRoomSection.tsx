import React, { useState } from "react";

interface Props {
  onCreateRoom: (event: React.FormEvent, id: string) => void;
}

export const CreateRoomSection: React.FC<Props> = ({ onCreateRoom }) => {
  const [newRoomId, setNewRoomId] = useState("");

  return (
    <section>
      <h2>Create a new room</h2>
      <form onSubmit={(event) => onCreateRoom(event, newRoomId)}>
        <div>
          <label htmlFor="room">Room name:</label>
          <input
            type="text"
            id="room"
            value={newRoomId}
            onChange={(e) => setNewRoomId(e.target.value)}
          />
        </div>
        <button disabled={!newRoomId} type="submit">
          Join
        </button>
      </form>
    </section>
  );
};
