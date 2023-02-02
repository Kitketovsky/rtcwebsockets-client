export const rtcCreateOffer = async (p2p: RTCPeerConnection) => {
  const offer = await p2p.createOffer();
  await p2p.setLocalDescription(offer);

  return offer;
};
