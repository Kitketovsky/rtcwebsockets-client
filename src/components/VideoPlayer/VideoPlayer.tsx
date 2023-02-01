import { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current!.srcObject = stream;
  }, []);

  return (
    <video
      ref={videoRef}
      style={{ width: 150 }}
      playsInline
      controls={false}
      autoPlay
    />
  );
};
