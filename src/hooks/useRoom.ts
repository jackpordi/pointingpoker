import {
  useEffect, useMemo, useRef, useState,
} from "preact/hooks";
import { ReconnectingWs } from "reconnecting-ws";
import {
  ClearMessage,
  IUserState,
  PointsChosenMessage,
  RevealMessage,
  OutgoingMessage,
  IObserver,
} from "../types";

function constructWSUrl(
  roomId: string,
  name: string,
  observing: boolean,
) {
  const protocol = window.location.protocol === "https:"
    ? "wss"
    : "ws";

  const query = new URLSearchParams({
    room: roomId,
    name,
    observing: observing.toString(),
  });

  return `${protocol}://${window.location.host}/ws?${query.toString()}`;
}

export function useRoom(
  id: string,
  name: string,
  observing: boolean,
) {
  const [ ws, setWs ] = useState<ReconnectingWs | undefined>();

  const [ state, setState ] = useState<IUserState[]>([]);
  const [ observers, setObservers ] = useState<IObserver[]>([]);

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
        setObservers(payload.observers);
        const me = payload.users.find((u) => u.id === uid.current);

        const myPick = me?.picked;
        if (typeof myPick === "number") setChosen(myPick);
        else (setChosen(undefined));
      } else if (payload.type === "Identify") {
        uid.current = payload.id;
      }
    };

    const socket = new ReconnectingWs({
      onOpen,
      onClose,
      onMessage,
      url: constructWSUrl(id, name, observing),
    });

    setWs(socket);

    return () => {
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

  const consensus = useMemo(() => {
    if (!revealed || state.length <= 1) return false;

    const picks = state.map((u) => u.picked);

    const allEqual = picks.every((p) => p === picks[0]) && typeof picks[0] === "number";
    return allEqual;
  }, [ state ]);

  return {
    revealed,
    connected,
    users: state,
    pick,
    chosen,
    reveal,
    clear,
    observers,
    consensus,
  } as const;
}
