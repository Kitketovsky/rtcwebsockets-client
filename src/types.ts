import { Socket } from "socket.io-client";

export type ISocketConnectionStatus =
  | "connect"
  | "error"
  | "disconnect"
  | "loading";

export type ISocketContext = {
  socket: Socket;
  status: ISocketConnectionStatus;
  username: string;
  rooms: string[];
  setUsernameDispatch: (newUsername: ISocketContext["username"]) => void;
};
