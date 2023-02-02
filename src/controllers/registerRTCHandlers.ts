import { Socket } from "socket.io-client";
import { ACTIONS } from "../const/actions";

export const registerRTCHandlers = (
  socket: Socket,
  p2p?: RTCPeerConnection
) => {
  // Если мы новый пользователь, то мы получаем offer от существующих пользователей в комнате
  socket.on(ACTIONS.OFFER, (data) => {
    console.log("We got an offer!");
    const { idFrom, offer } = data;
    // Мы получаем SDP offer, вставляем в RTC, создаем SDP answer
    // insert code...
    // Отправляем наш SDP answer
    socket.emit(ACTIONS.ANSWER, {
      idTo: idFrom,
      idFrom: socket.id,
      answer: "This is my answer",
    });
  });

  // Ждем SDP answer после отправления SDP offer
  socket.on(ACTIONS.ANSWER, (data) => {
    console.log("We got an answer!");
    // Создаем SDP description и вставляем в setRemoteDescription
  });
};
