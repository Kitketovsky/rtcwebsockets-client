import { SocketContext } from "../context/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { ISocketConnectionStatus, ISocketContext } from "../types";
import { ACTIONS } from "../const/actions";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef(io("http://localhost:8000"));

  const [status, setStatus] = useState<ISocketConnectionStatus>("loading");
  const [rooms, setRooms] = useState<ISocketContext["rooms"]>([]);
  const [username, setUsername] = useState<ISocketContext["username"]>("");

  const setUsernameDispatch = (newUsername: ISocketContext["username"]) => {
    setUsername(newUsername);
  };

  useEffect(() => {
    const socket = socketRef.current;

    socket.on("connect", () => {
      setStatus("connect");
    });

    socket.on(ACTIONS.ROOM_LIST, (rooms) => {
      setRooms(rooms);
    });

    socket.on("disconnect", () => {
      setStatus("disconnect");
    });

    socket.io.on("error", () => {
      setStatus("error");
    });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current!,
        status,
        username,
        rooms,
        setUsernameDispatch,
      }}
    >
      {status === "loading" ? <h1>Loading...</h1> : children}
    </SocketContext.Provider>
  );
};
