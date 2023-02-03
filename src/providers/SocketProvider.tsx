import { SocketContext } from "../context/SocketContext";
import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ISocketConnectionStatus, ISocketContext } from "../types";
import { ACTIONS } from "../const/actions";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket>();

  const [status, setStatus] = useState<ISocketConnectionStatus>("loading");
  const [rooms, setRooms] = useState<ISocketContext["rooms"]>([]);
  const [username, setUsername] = useState<ISocketContext["username"]>("");

  const setUsernameDispatch = (newUsername: ISocketContext["username"]) => {
    setUsername(newUsername);
  };

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socketRef.current = socket;

    socket.on("connect", () => {
      setStatus("connect");
      socket.emit(ACTIONS.ROOM_LIST);
    });

    socket.on(ACTIONS.ROOM_LIST, (remoteRooms) => {
      setRooms(remoteRooms);
    });

    socket.on("disconnect", () => {
      setStatus("disconnect");
    });

    socket.io.on("error", () => {
      setStatus("error");
    });

    return () => {
      socket.close();
    };
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
