import React, { useContext } from "react";
import { SocketContext } from "../../context/SocketContext";
import { ACTIONS } from "../../const/actions";
import { useNavigate } from "react-router";
import { UsernamePage } from "../UsernamePage/UsernamePage";
import { WelcomePage } from "../WelcomePage/WelcomePage";

export const LoginPage = () => {
  const { socket, rooms, username, setUsernameDispatch } =
    useContext(SocketContext)!;

  const navigate = useNavigate();

  const onCreateRoom = (event: React.FormEvent, id: string) => {
    event.preventDefault();
    socket.emit(ACTIONS.ROOM_CREATE, id);
    navigate(`/${id}`);
  };

  const onJoinRoom = (id: string) => {
    socket.emit(ACTIONS.JOIN, id);
    navigate(`/${id}`);
  };

  const onNewUsername = (event: React.FormEvent, localUsername: string) => {
    event.preventDefault();
    setUsernameDispatch(localUsername);
  };

  return username ? (
    <WelcomePage
      username={username}
      rooms={rooms}
      onCreateRoom={onCreateRoom}
      onJoinRoom={onJoinRoom}
    />
  ) : (
    <UsernamePage onNewUsername={onNewUsername} />
  );
};
