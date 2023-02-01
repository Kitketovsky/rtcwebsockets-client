export const navigatorGetLocalStream = async (p2p: RTCPeerConnection) => {
  // Only on initialization
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  localStream.getTracks().forEach((track) => {
    p2p.addTrack(track, localStream);
  });

  return localStream;
};
