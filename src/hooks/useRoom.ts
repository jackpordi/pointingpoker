import { useEffect, useRef, useState } from "preact/hooks";
import { ReconnectingWs } from "reconnecting-ws";
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
  const [ ws, setWs ] = useState<ReconnectingWs | undefined>();

  const [ state, setState ] = useState<IUserState[]>([]);
  const [ revealed, setRevealed ] = useState(false);

  const [ connected, setConnected ] = useState(false);

  const uid = useRef<string | undefined>();
  const [ chosen, setChosen ] = useState<number | undefined>();

  function setupWS() {
    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const onMessage = (payload: OutgoingMessage) => {
      if (payload.type === "State") {
        setState(payload.users);
        setRevealed(payload.revealed);
        const me = payload.users.find((u) => u.id === uid.current);

        const myPick = me?.picked;
        if (typeof myPick === "number") setChosen(myPick);
        else (setChosen(undefined));
      } else if (payload.type === "Identify") {
        uid.current = payload.id;
      } else if (payload.type === "Pong") {
        // Do nothing
      }
    };

    const socket = new ReconnectingWs({
      onOpen,
      onClose,
      onMessage,
      url: constructWSUrl(id, name),
    });

    const pingInterval = setInterval(() => {
      const payload: PingMessage = { type: "Ping" };
      socket.send(payload);
    }, 5000);

    setWs(socket);
    return () => {
      clearInterval(pingInterval);
      socket.cleanup();
    };
  }

  useEffect(() => setupWS(), []);

  const pick = (n: number | null) => {
    if (!ws) return;
    const payload: PointsChosenMessage = {
      type: "PointsChosen",
      points: n,
    };
    ws.send(payload);
  };

  const reveal = () => {
    if (!ws) return;
    const payload: RevealMessage = {
      type: "Reveal",
    };
    ws.send(payload);
  };

  const clear = () => {
    if (!ws) return;
    const payload: ClearMessage = {
      type: "Clear",
    };
    ws.send(payload);
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
