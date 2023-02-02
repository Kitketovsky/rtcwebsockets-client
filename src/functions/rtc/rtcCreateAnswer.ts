export const rtcCreateAnswer = async (
  p2p: RTCPeerConnection,
  offer: RTCSessionDescriptionInit
) => {
  const remoteDesc = new RTCSessionDescription(offer);
  await p2p.setRemoteDescription(remoteDesc);

  const answer = await p2p.createAnswer();
  await p2p.setLocalDescription(answer);

  return answer;
};
