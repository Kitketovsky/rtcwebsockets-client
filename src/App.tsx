import { useRef } from "react";
import { useVideoCall } from "./useVideoCall";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";

function App() {
  const userIdRef = useRef(crypto.randomUUID());
  const streams = useVideoCall(userIdRef.current);

  return (
    <div>
      <h1>Hello React!</h1>
      {streams.map((stream) => (
        <VideoPlayer stream={stream} key={crypto.randomUUID()} />
      ))}
    </div>
  );
}

export default App;
