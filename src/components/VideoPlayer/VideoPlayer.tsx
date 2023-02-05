import { useMediaStreamTracks } from "../../hooks/useMediaStreamTracks";

export const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const { videoRef, isVideoMuted, toggleVideo, toggleAudio, isAudioMuted } =
    useMediaStreamTracks(stream);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: 150 }}
        playsInline
        controls={false}
        autoPlay
      />
      {stream && (
        <div>
          <button onClick={toggleVideo}>
            {isVideoMuted ? "Unmute" : "Mute"} video
          </button>
          <button onClick={toggleAudio}>
            {isAudioMuted ? "Unmute" : "Mute"} audio
          </button>
        </div>
      )}
    </div>
  );
};
