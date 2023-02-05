import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ACTIONS } from "../const/actions";
import { rtcCreateOffer } from "../functions/rtc/rtcCreateOffer";
import { rtcCreateAnswer } from "../functions/rtc/rtcCreateAnswer";
import { rtcAssignAnswer } from "../functions/rtc/rtcAssignAnswer";
import { rtcCreateConnection } from "../functions/rtc/rtcCreateConnection";
import { SocketContext } from "../context/SocketContext";

interface RemoteStreams {
  id: string;
  stream: MediaStream;
}

// TODO: Room functionality
// TODO: Toggle video and audio in a stream
export const useVideoCall = () => {
  const { socket } = useContext(SocketContext)!;

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStreams, setRemoteStreams] = useState<RemoteStreams[]>([]);

  const p2psRef = useRef<Map<string, RTCPeerConnection>>(new Map());

  const onNewRemoteStream = useCallback(
    (newRemoteStream: MediaStream, idTo: string) =>
      setRemoteStreams((prevRemotes) =>
        prevRemotes
          .filter(({ id }) => id !== idTo)
          .concat({ id: idTo, stream: newRemoteStream })
      ),
    []
  );

  useEffect(() => {
    socket.on(ACTIONS.ROOM_NEW_CLIENT_NOTIFICATION, async (idFrom) => {
      console.log(`A new client ${idFrom} connected!`);

      const { p2p, localStream } = await rtcCreateConnection({
        idTo: idFrom,
        idFrom: socket.id,
        socket,
        onNewRemoteStream,
      });

      setLocalStream(localStream);

      if (!p2psRef.current.has(idFrom)) {
        p2psRef.current.set(idFrom, p2p);
      }

      const offer = await rtcCreateOffer(p2p);

      socket.emit(ACTIONS.RTC_OFFER, {
        idFrom: socket.id,
        idTo: idFrom,
        offer: offer,
      });
    });

    socket.on(ACTIONS.ROOM_CLIENT_LEAVE_NOTIFICATION, (disconnectedUserId) => {
      setRemoteStreams((prevStreams) =>
        prevStreams.filter(({ id }) => id !== disconnectedUserId)
      );

      console.log("someone left the room");

      if (p2psRef.current.has(disconnectedUserId)) {
        p2psRef.current.get(disconnectedUserId)!.close();
        p2psRef.current.delete(disconnectedUserId);
      }
    });

    // Если мы новый пользователь, то мы получаем offer от существующих пользователей в комнате
    socket.on(ACTIONS.RTC_OFFER, async ({ idFrom, offer }) => {
      const { p2p, localStream } = await rtcCreateConnection({
        idTo: idFrom,
        idFrom: socket.id,
        socket,
        onNewRemoteStream,
      });

      setLocalStream(localStream);

      const answer = await rtcCreateAnswer(p2p, offer);

      if (!p2psRef.current.has(idFrom)) {
        p2psRef.current.set(idFrom, p2p);
      }

      socket.emit(ACTIONS.RTC_ANSWER, {
        idTo: idFrom,
        idFrom: socket.id,
        answer: answer,
      });
    });

    socket.on(ACTIONS.RTC_ANSWER, async ({ idFrom, answer }) => {
      const p2p = p2psRef.current.get(idFrom)!;
      await rtcAssignAnswer(p2p, answer);
    });

    socket.on(ACTIONS.RTC_ICE, async ({ idFrom, ice }) => {
      if (ice) {
        try {
          const p2p = p2psRef.current.get(idFrom)!;
          await p2p.addIceCandidate(ice);
        } catch (error) {
          console.log("Error adding ice candidate to RTCPeerConnection...");
        }
      }
    });

    return () => {
      socket.emit(ACTIONS.ROOM_LEAVE);
      p2psRef.current;
    };
  }, []);

  return {
    localStream,
    remoteStreams,
  };
};
