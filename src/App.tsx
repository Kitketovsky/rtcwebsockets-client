import { useEffect } from "react";
import io from "socket.io-client";
import { registerRTCHandlers } from "./controllers/registerRTCHandlers";
import { registerClientStatusHandlers } from "./controllers/registerClientStatusHandlers";
function App() {
  useEffect(() => {
    const socket = io("http://localhost:8000");

    const onConnection = () => {
      registerClientStatusHandlers(socket);
      registerRTCHandlers(socket);
    };

    socket.on("connect", onConnection);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Hello React!</h1>
    </div>
  );
}

export default App;
