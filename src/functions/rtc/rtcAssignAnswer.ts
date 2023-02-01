export const rtcAssignAnswer = async (
  p2p: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) => {
  const remoteDesc = new RTCSessionDescription(answer);
  await p2p.setRemoteDescription(remoteDesc);
};
