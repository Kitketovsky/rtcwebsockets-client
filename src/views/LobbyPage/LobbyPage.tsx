import React, { useCallback, useContext } from "react";
import { ISocketContext } from "../../types";
import { RoomsSection } from "../../components/RoomsSection/RoomsSection";
import { CreateRoomSection } from "../../components/CreateRoomSection/CreateRoomSection";
import { SocketContext } from "../../context/SocketContext";
import { useNavigate } from "react-router";
import { ACTIONS } from "../../const/actions";
import { Header } from "../../components/Header/Header";

interface Props {
  username: ISocketContext["username"];
}
export const LobbyPage: React.FC<Props> = ({ username }) => {
  const { socket, rooms } = useContext(SocketContext)!;

  const navigate = useNavigate();

  const onCreateRoom = (event: React.FormEvent, id: string) => {
    event.preventDefault();
    socket.emit(ACTIONS.ROOM_CREATE, id);
    navigate(`/room:${id}`);
  };

  const onJoinRoom = (id: string) => {
    socket.emit(ACTIONS.ROOM_JOIN, id);
    navigate(`/${id}`);
  };

  return (
    <div>
      <Header username={username} />
      <RoomsSection rooms={rooms} onJoinRoom={onJoinRoom} />
      <CreateRoomSection onCreateRoom={onCreateRoom} />
    </div>
  );
};
