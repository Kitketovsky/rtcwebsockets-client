import { useEffect, useRef } from "react";
import io from "socket.io-client";

const ACTIONS = {
  CONNECTED: "connected",
  JOIN: "join",
  NEW_CLIENT: "new_client",
  OFFER: "offer",
  ANSWER: "answer",
  ICE: "ice",
};

function App() {
  const userIdRef = useRef<string>();
  // const streams = useVideoCall(userIdRef.current);

  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO!");

      socket.emit(ACTIONS.JOIN, socket.id);

      // В namespace заходит новый пользователь, мы с ним должны обменяться SDP
      socket.on(ACTIONS.NEW_CLIENT, (newClientId) => {
        // Отправляем наш SDP offer
        socket.emit(ACTIONS.OFFER, {
          idFrom: socket.id,
          idTo: newClientId,
          offer: "This is my offer",
        });
      });

      // Если мы новый пользователь, то мы получаем offer от существующих пользователей в комнате
      socket.on(ACTIONS.OFFER, (data) => {
        const { idFrom, offer } = data;
        // Получил оффер, вставляю в RTC, создаю answer и его отправляю
        console.log(data);

        // Отправляем наш ответ
        socket.emit(ACTIONS.ANSWER, {
          answer: "This is my answer",
          idTo: idFrom,
          idFrom: socket.id,
        });
      });

      // Если мы отправили offer и ждем answer
      socket.on(ACTIONS.ANSWER, (data) => {
        console.log(data);
      });
    });
  }, []);

  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  );
}

export default App;
