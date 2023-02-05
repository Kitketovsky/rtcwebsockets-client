import { useVideoCall } from "../../hooks/useVideoCall";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";

export const ConversationPage = () => {
  const { localStream, remoteStreams } = useVideoCall();

  return (
    <div>
      <h1>Conversation Page</h1>

      <div>
        {localStream && <VideoPlayer stream={localStream} />}
        {remoteStreams.map(({ stream, id }) => (
          <VideoPlayer key={id} stream={stream} />
        ))}
      </div>
    </div>
  );
};
