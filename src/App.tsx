import { useEffect, useRef } from "react";

function App() {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket("wss://rtcwebsockets-server.herokuapp.com");

    ws.current.addEventListener("open", () => {
      console.log("CLIENT:: WebSocket connection is established...");
    });

    ws.current?.addEventListener("message", (event) => {
      console.log(event.data);
    });
  }, []);

  return (
    <div>
      <h1>Hello React!</h1>
      <button onClick={() => ws.current?.send("Hello from client!")}>
        Send Hello!
      </button>
    </div>
  );
}

export default App;
