import { useVideoCall } from "./hooks/useVideoCall";
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer";
function App() {
  const { localStream, remoteStreams } = useVideoCall();

  return (
    <div>
      <h1>Hello WebRTC and Socket.IO!</h1>
      {localStream && <VideoPlayer key={localStream.id} stream={localStream} />}

      {remoteStreams.map(({ id, stream }) => (
        <VideoPlayer key={id} stream={stream} />
      ))}
    </div>
  );
}

export default App;
