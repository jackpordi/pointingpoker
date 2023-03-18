import { useEffect, useRef, useState } from "preact/hooks";
import {
  ClearMessage,
  IUserState,
  PointsChosenMessage,
  RevealMessage,
  OutgoingMessage,
  PingMessage,
} from "../types";

function constructWSUrl(roomId: string, name: string) {
  const protocol = window.location.protocol === "https:"
    ? "wss"
    : "ws";

  return `${protocol}://${window.location.host}/ws?name=${name}&room=${roomId}`;
}

export function useRoom(id: string, name: string) {
  const [ ws, setWs ] = useState<WebSocket | undefined>();

  const [ state, setState ] = useState<IUserState[]>([]);
  const [ revealed, setRevealed ] = useState(false);

  const [ connected, setConnected ] = useState(false);

  const uid = useRef<string | undefined>();
  const [ chosen, setChosen ] = useState<number | undefined>();

  function setupWS() {
    const socket = new WebSocket(constructWSUrl(id, name));

    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const pingInterval = setInterval(() => {
      const payload: PingMessage = { type: "Ping" };
      socket.send(JSON.stringify(payload));
    }, 5000);

    const onMessage = (message: MessageEvent) => {
      const parsed: OutgoingMessage = JSON.parse(message.data as string) as OutgoingMessage;

      if (parsed.type === "State") {
        setState(parsed.users);
        setRevealed(parsed.revealed);
        const me = parsed.users.find((u) => u.id === uid.current);

        const myPick = me?.picked;
        if (typeof myPick === "number") setChosen(myPick);
      } else if (parsed.type === "Identify") {
        uid.current = parsed.id;
      } else if (parsed.type === "Pong") {
        // Do nothing
      }
    };
    socket.addEventListener("open", onOpen);
    socket.addEventListener("close", onClose);
    socket.addEventListener("message", onMessage);

    setWs(socket);
    return () => {
      clearInterval(pingInterval);
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("close", onClose);
      socket.removeEventListener("message", onMessage);
      socket.close();
    };
  }

  useEffect(() => setupWS(), []);

  const pick = (n: number | null) => {
    if (!ws) return;
    const payload: PointsChosenMessage = {
      type: "PointsChosen",
      points: n,
    };
    ws.send(JSON.stringify(payload));
  };

  const reveal = () => {
    if (!ws) return;
    const payload: RevealMessage = {
      type: "Reveal",
    };
    ws.send(JSON.stringify(payload));
  };

  const clear = () => {
    if (!ws) return;
    const payload: ClearMessage = {
      type: "Clear",
    };
    ws.send(JSON.stringify(payload));
  };

  return {
    revealed,
    connected,
    users: state,
    pick,
    chosen,
    reveal,
    clear,
  } as const;
}
