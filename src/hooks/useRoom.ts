/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'preact/hooks';
import {
  ClearMessage, IUserState, OutgoingMessage, PointsChosenMessage, RevealMessage,
} from '../types';

export function useRoom(name: string) {
  const [ws, setWs] = useState<WebSocket | undefined>();

  const [state, setState] = useState<IUserState[]>([]);
  const [ revealed, setRevealed ] = useState(false);

  const [connected, setConnected] = useState(false);

  function setupWS() {
    const socket = new WebSocket(`ws://${window.location.host}/ws?name=${name}`);

    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const onMessage = (message) => {
      const parsed: OutgoingMessage = JSON.parse(message.data);
      console.log(parsed);
      setState(parsed.users);
      setRevealed(parsed.revealed);
    };
    socket.addEventListener('open', onOpen);
    socket.addEventListener('close', onClose);
    socket.addEventListener('message', onMessage);

    setWs(socket);
    return () => {
      socket.removeEventListener('open', onOpen);
      socket.removeEventListener('close', onClose);
      socket.removeEventListener('message', onMessage);
      socket.close();
    };
  }

  useEffect(() => setupWS(), []);

  const pick = (n: number | null) => {
    if (!ws) return;
    const payload: PointsChosenMessage = {
      type: 'PointsChosen',
      points: n,
    };
    ws.send(JSON.stringify(payload));
  };

  const reveal = () => {
    if (!ws) return;
    const payload: RevealMessage = {
      type: 'Reveal',
    };
    ws.send(JSON.stringify(payload));
  };

  const clear = () => {
    if (!ws) return;
    const payload: ClearMessage = {
      type: 'Clear',
    };
    ws.send(JSON.stringify(payload));
  };

  return {
    revealed,
    connected,
    users: state,
    pick,
    reveal,
    clear,
  } as const;
}