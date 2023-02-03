import React, { useState } from "react";
import { ISocketContext } from "../../types";

interface Props {
  username: ISocketContext["username"];
  rooms: ISocketContext["rooms"];
  onJoinRoom: (id: string) => void;
  onCreateRoom: (event: React.FormEvent, id: string) => void;
}
export const WelcomePage: React.FC<Props> = ({
  rooms,
  onJoinRoom,
  onCreateRoom,
  username,
}) => {
  const [newRoomId, setNewRoomId] = useState("");

  return (
    <div>
      <h1>Login Page</h1>
      <h2>Welcome, {username}!</h2>
      <div>
        <h2>Rooms</h2>
        {rooms?.length ? (
          rooms?.map((id) => (
            <div key={id}>
              <span>Name: {id.slice(5)}</span>
              <button onClick={() => onJoinRoom(id)}>Join</button>
            </div>
          ))
        ) : (
          <span>There's no rooms right now :(</span>
        )}
      </div>

      <div>
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
      </div>
    </div>
  );
};
