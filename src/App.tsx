import { useEffect, useRef } from "react";

// "wss://rtcwebsockets-server.herokuapp.com"

const createOffer = async (p2p: RTCPeerConnection, ws: WebSocket) => {
  const offer = await p2p.createOffer();
  await p2p.setLocalDescription(offer);

  ws.send(JSON.stringify({ type: "offer", offer }));
};

const createAnswer = async (
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

const assignAnswer = async (
  p2p: RTCPeerConnection,
  answer: RTCSessionDescriptionInit
) => {
  const remoteDesc = new RTCSessionDescription(answer);
  await p2p.setRemoteDescription(remoteDesc);
};

function App() {
  const socketRef = useRef<WebSocket | null>(null);
  const p2pRef = useRef<RTCPeerConnection | null>(null);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const p2p = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun1.1.google.com:19302" },
        { urls: "stun:stun2.1.google.com:19302" },
      ],
    });

    p2p.addEventListener("connectionstatechange", (event) => {
      console.log(p2p.connectionState);
    });

    p2pRef.current = p2p;

    async function createConnection() {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      const remoteStream = new MediaStream();

      localVideoRef.current!.srcObject = localStream;

      localStream.getTracks().forEach((track) => {
        p2p.addTrack(track, localStream);
      });

      p2p.addEventListener("track", async (event) => {
        event.streams[0].getTracks().forEach((remoteTrack) => {
          remoteStream.addTrack(remoteTrack);
        });
      });

      remoteVideoRef.current!.srcObject = remoteStream;
    }

    createConnection();
  }, []);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
    const p2p = p2pRef.current!;

    socketRef.current = ws;

    p2p.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ type: "ice", ice: event.candidate }));
      }
    });

    ws.onopen = () =>
      ws.send(JSON.stringify({ type: "joined", msg: crypto.randomUUID() }));

    ws.addEventListener("message", async (event) => {
      if (event.data) {
        const parsed = JSON.parse(event.data);

        try {
          await p2p.addIceCandidate(parsed.ice);
        } catch (e) {
          console.error("Error adding received ice candidate", e);
        }
      }
    });

    ws.onmessage = (event) => {
      if (event.data) {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "notification") {
          console.log(parsed.msg);
        }

        if (parsed.type === "joined") {
          console.log("A new user has joined the channel...");

          createOffer(p2p, ws);
        }

        if (parsed.type === "offer") {
          console.log("Client got offer");
          createAnswer(p2p, ws, parsed.offer);
        }

        if (parsed.type === "answer") {
          console.log("Client got answer");
          assignAnswer(p2p, parsed.answer);
        }
      }
    };
  }, []);

  return (
    <div>
      <h1>Hello React!</h1>
      <video
        style={{ width: 150 }}
        ref={localVideoRef}
        playsInline
        controls={false}
        autoPlay
      ></video>
      <video
        style={{ width: 150 }}
        ref={remoteVideoRef}
        playsInline
        controls={false}
        autoPlay
      ></video>
    </div>
  );
}

export default App;
