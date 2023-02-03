import React, { useCallback, useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { UsernamePage } from "../UsernamePage/UsernamePage";
import { LobbyPage } from "../LobbyPage/LobbyPage";

export const LoginPage = () => {
  const { username, setUsernameDispatch } = useContext(SocketContext)!;

  const onNewUsername = useCallback(
    (event: React.FormEvent, localUsername: string) => {
      event.preventDefault();
      setUsernameDispatch(localUsername);
    },
    []
  );

  return username ? (
    <LobbyPage username={username} />
  ) : (
    <UsernamePage onNewUsername={onNewUsername} />
  );
};
