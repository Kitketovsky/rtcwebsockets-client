import { rtcConfiguration } from "../../const/rtcConfiguration";
import { ACTIONS } from "../../const/actions";
import { Socket } from "socket.io-client";

export const rtcCreateConnection = ({
  localStream,
  socket,
  idFrom,
  idTo,
  onNewRemoteStream,
}: {
  localStream: MediaStream;
  socket: Socket;
  idFrom: string;
  idTo: string;
  onNewRemoteStream: (rs: MediaStream, idTo: string) => void;
}) => {
  const p2p = new RTCPeerConnection(rtcConfiguration);

  localStream.getTracks().forEach((track) => {
    p2p.addTrack(track, localStream);
  });

  p2p.onicecandidate = (event) => {
    // Как то нужно хранить ID ресипиента
    try {
      if (event.candidate) {
        socket.emit(ACTIONS.RTC_ICE, {
          idFrom,
          idTo,
          ice: event.candidate,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  p2p.ontrack = async (event) => {
    const newRemoteStream = new MediaStream();

    const [remoteStream] = event.streams;

    remoteStream.getTracks().forEach((remoteTrack) => {
      newRemoteStream.addTrack(remoteTrack);
    });

    onNewRemoteStream(newRemoteStream, idTo);
  };

  return { p2p };
};
