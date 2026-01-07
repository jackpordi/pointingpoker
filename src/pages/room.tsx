import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { InputName } from "components/InputName";
import { Session } from "components/Session";
import { useLastRoom } from "hooks/useLastRoom";

type AwaitingState = undefined;

interface PlayingState {
  name: string;
  observing: false;
}

interface ObservingState {
  name: string;
  observing: true;
}

type RoomState = PlayingState | ObservingState | AwaitingState;

export const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [ state, setState ] = useState<RoomState>();

  const { lastRoom, setLastRoom } = useLastRoom();

  const join = useCallback((name: string, observing: boolean) => {
    if (!roomId) return;
    setState({
      name,
      observing,
    });
    setLastRoom(roomId, name);
  }, [ roomId, setLastRoom ]);

  if (!roomId) return null;

  if (state?.name) return <Session name={state.name} id={roomId} observing={state.observing} />;

  return (
    <div className="flex flex-col w-full items-center min-h-screen justify-center p-4">
      <InputName
        roomName={roomId}
        initialName={lastRoom?.[1]}
        join={join}
      />
    </div>
  );
};
