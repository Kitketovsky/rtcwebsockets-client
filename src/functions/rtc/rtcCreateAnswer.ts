export const rtcCreateAnswer = async (
  p2p: RTCPeerConnection,
  ws: WebSocket,
  offer: RTCSessionDescriptionInit
) => {
  const remoteDesc = new RTCSessionDescription(offer);
  await p2p.setRemoteDescription(remoteDesc);

  const answer = await p2p.createAnswer();
  await p2p.setLocalDescription(answer);

  ws.send(JSON.stringify({ type: "answer", answer }));
};
