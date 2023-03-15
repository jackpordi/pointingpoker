/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'preact/hooks';
import {
  ClearMessage, IUserState, PointsChosenMessage, RevealMessage,
} from '../types';

export function useRoom(name: string) {
  const [ws, setWs] = useState<WebSocket | undefined>();

  const [state, setState] = useState<IUserState[]>([]);

  const [connected, setConnected] = useState(false);

  function setupWS() {
    const socket = new WebSocket(`ws://localhost:3000/ws?name=${name}`);

    const onOpen = () => {
      setConnected(true);
    };

    const onClose = () => {
      setConnected(false);
    };

    const onMessage = (message) => {
      const parsed = JSON.parse(message.data);
      setState(parsed);
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

  console.log(connected);
  return {
    connected,
    users: state,
    pick,
    reveal,
    clear,
  } as const;
}
