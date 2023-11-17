import { useCallback, useState } from "preact/hooks";
import { InputName } from "components/InputName";
import { Session } from "components/Session";
import { FunctionComponent } from "preact";
import { useLastRoom } from "hooks/useLastRoom";

interface Props {
  roomId: string;
}

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

export const Room: FunctionComponent<Props> = ({ roomId }) => {
  const [ state, setState ] = useState<RoomState>();

  const { lastRoom, setLastRoom } = useLastRoom();

  const join = useCallback((name: string, observing: boolean) => {
    setState({
      name,
      observing,
    });
    setLastRoom(roomId, name);
  }, [ setState, roomId ]);

  if (state?.name) return <Session name={state.name} id={roomId} observing={state.observing} />;

  return (
    <div className="flex flex-col w-full items-center min-h-screen justify-center">
      <InputName
        roomName={roomId}
        initialName={lastRoom?.[1]}
        join={join}
      />
    </div>
  );
};
