import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export const useMediaStreamTracks = (stream: MediaStream) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = stream;
  }, [stream]);

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const toggleVideo = () => {
    flushSync(() => {
      setIsVideoMuted((v) => !v);
    });

    stream.getVideoTracks().forEach((track) => {
      track.enabled = isVideoMuted;
    });
  };

  const toggleAudio = () => {
    flushSync(() => {
      setIsAudioMuted((a) => !a);
    });

    stream.getAudioTracks().forEach((track) => {
      track.enabled = isAudioMuted;
    });
  };

  return { toggleAudio, toggleVideo, isAudioMuted, isVideoMuted, videoRef };
};
