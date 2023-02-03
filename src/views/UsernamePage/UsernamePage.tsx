import React, { useState } from "react";

interface Props {
  onNewUsername: (event: React.FormEvent, localUsername: string) => void;
}
export const UsernamePage: React.FC<Props> = ({ onNewUsername }) => {
  const [localUsername, setLocalUsername] = useState("");

  return (
    <div>
      <h1>Login Page</h1>

      <div>
        <span>What's your username?</span>

        <form onSubmit={(event) => onNewUsername(event, localUsername)}>
          <div>
            <label htmlFor="username">Your name:</label>
            <input
              type="text"
              id="username"
              value={localUsername}
              onChange={(e) => setLocalUsername(e.target.value)}
            />
          </div>
          <button disabled={!localUsername} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
