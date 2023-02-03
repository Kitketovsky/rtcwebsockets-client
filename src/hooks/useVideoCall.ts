import { useCallback, useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
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

  const localStreamRef = useRef<MediaStream>();
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
    if (!localStreamRef.current) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((locStream) => {
          localStreamRef.current = locStream;
          setLocalStream(locStream);
        });
    }

    socket.on(ACTIONS.CLIENT_NEW, async ({ id: idFrom }) => {
      console.log(`A new client ${idFrom} connected!`);

      const { p2p } = rtcCreateConnection({
        idTo: idFrom,
        idFrom: socket.id,
        socket,
        onNewRemoteStream,
        localStream: localStreamRef.current!,
      });

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

    // Если мы новый пользователь, то мы получаем offer от существующих пользователей в комнате
    socket.on(ACTIONS.RTC_OFFER, async ({ idFrom, offer }) => {
      console.log(`We got the offer from ${idFrom}!`);

      const { p2p } = rtcCreateConnection({
        idTo: idFrom,
        idFrom: socket.id,
        socket,
        onNewRemoteStream,
        localStream: localStreamRef.current!,
      });

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
      console.log(`We got the answer from ${idFrom}!`);

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

    socket.on(ACTIONS.CLIENT_DISCONNECTED, ({ id: disconnectedUserId }) => {
      setRemoteStreams((prevStreams) =>
        prevStreams.filter(({ id }) => id !== disconnectedUserId)
      );

      if (p2psRef.current.has(disconnectedUserId)) {
        p2psRef.current.get(disconnectedUserId)!.close();
        p2psRef.current.delete(disconnectedUserId);
      }
    });

    return () => {
      socket.close();
      p2psRef.current.forEach((p2p) => p2p.close());
    };
  }, []);

  return {
    localStream,
    remoteStreams,
  };
};
