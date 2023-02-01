export const rtcCreateOffer = async (p2p: RTCPeerConnection, ws: WebSocket) => {
  const offer = await p2p.createOffer();
  await p2p.setLocalDescription(offer);

  ws.send(JSON.stringify({ type: "offer", offer }));
};
