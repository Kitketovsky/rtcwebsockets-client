import { useEffect, useState } from "react";
import { socketOnMessageHandler } from "./functions/socket/socketOnMessageHandler";
import { navigatorGetLocalStream } from "./functions/navigator/navigatorGetLocalStream";

export const useVideoCall = (userId: string) => {
  const [localVideo, setLocalVideo] = useState<MediaStream>();
  const [remoteVideo, setRemoteVideo] = useState<MediaStream>();

  useEffect(() => {
    const p2p = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.1.google.com:19302" },
        { urls: "stun:stun2.1.google.com:19302" },
      ],
    });

    const socket = new WebSocket("wss://rtcwebsockets-server.herokuapp.com");

    socket.onopen = () =>
      socket.send(JSON.stringify({ type: "joined", msg: userId }));

    socket.onmessage = (event) => socketOnMessageHandler(event, p2p, socket);

    socket.onclose = () => p2p.close();

    navigatorGetLocalStream(p2p).then((localStream) =>
      setLocalVideo(localStream)
    );

    p2p.ontrack = async (event) => {
      const newRemoteStream = new MediaStream();

      const [remoteStream] = event.streams;

      remoteStream.getTracks().forEach((remoteTrack) => {
        newRemoteStream.addTrack(remoteTrack);
      });

      setRemoteVideo(newRemoteStream);
    };

    p2p.onicecandidate = (event) => {
      try {
        if (event.candidate) {
          socket.send(JSON.stringify({ type: "ice", ice: event.candidate }));
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return [localVideo, remoteVideo] as MediaStream[];
};
