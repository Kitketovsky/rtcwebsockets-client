import { useVideoCall } from "../../hooks/useVideoCall";
import { VideoPlayer } from "../../components/VideoPlayer/VideoPlayer";

export const ConversationPage = () => {
  const { localStream, remoteStreams } = useVideoCall();

  console.log("localStream", localStream);
  console.log("remoteStreams", remoteStreams);
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
