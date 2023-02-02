import { Socket } from "socket.io-client";
import { ACTIONS } from "../const/actions";

export const registerClientStatusHandlers = (
  socket: Socket,
  p2p?: RTCPeerConnection
) => {
  console.log("We connected to Socket.IO server!");
  socket.emit(ACTIONS.JOIN, socket.id);

  // В namespace заходит новый пользователь, мы с ним должны обменяться SDP
  socket.on(ACTIONS.NEW_CLIENT, (newClientId) => {
    console.log(`A new client ${newClientId} connected!`);
    // Отправляем наш SDP offer
    socket.emit(ACTIONS.OFFER, {
      idFrom: socket.id,
      idTo: newClientId,
      offer: "This is my offer",
    });
    console.log("We send our offer!");
  });
};
