import { rtcCreateOffer } from "../rtc/rtcCreateOffer";
import { rtcCreateAnswer } from "../rtc/rtcCreateAnswer";
import { rtcAssignAnswer } from "../rtc/rtcAssignAnswer";

export const socketOnMessageHandler = async (
  event: MessageEvent,
  p2p: RTCPeerConnection,
  socket: WebSocket
) => {
  if (event.data) {
    const body = JSON.parse(event.data);

    switch (body.type) {
      case "ice":
        await p2p.addIceCandidate(body.ice);
        return;
      case "notification":
        console.log(`CHANNEL:: ${body.msg}`);
        return;
      case "joined":
        console.log("CHANNEL:: A new user has joined the channel...");
        await rtcCreateOffer(p2p, socket);
        return;
      case "offer":
        console.log("CLIENT:: I got offer...");
        await rtcCreateAnswer(p2p, socket, body.offer);
        return;
      case "answer":
        console.log("CLIENT:: I got answer...");
        await rtcAssignAnswer(p2p, body.answer);
    }
  }
};
