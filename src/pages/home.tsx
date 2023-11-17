import { useCallback, useState } from "preact/hooks";
import Axios from "axios";
import { route } from "preact-router";
import { InputWithButton } from "components/InputWithButton";
import { useLastRoom } from "hooks/useLastRoom";

export function Home() {
  const [ roomCode, setRoomCode ] = useState("");

  const enterRoomDisabled = roomCode.length < 4;

  const goToNewRoom = async () => {
    const { data } = await Axios.put<{ id: string }>("/api/room");
    const { id } = data;
    route(`/${id.toLowerCase()}`);
  };

  const enterRoom = () => {
    route(`/${roomCode.toLowerCase()}`);
  };

  const { lastRoom } = useLastRoom();

  const goToLastRoom = useCallback(() => {
    if (lastRoom) route(`/${lastRoom[0]}`);
  }, [ lastRoom ]);

  return (
    <div className="w-full min-h-screen px-3">
      <div className="flex flex-col items-center justify-center mx-auto max-w-4xl w-full min-h-screen">

        <h1 className="text-7xl font-lobster my-4">
          Pointing Poker
        </h1>

      <div className="flex flex-col items-center w-full md:w-[320px] my-4">
            <InputWithButton
              id="room-code"
              label={"Room code"}
              hideLabel
              value={roomCode}
              onChange={(s) => setRoomCode(s.toUpperCase())}
              placeholder="Enter your room code"
              containerClassName="w-full"
              inputClassName="text-center text-xl font-bold placeholder:font-normal"
              onClick={enterRoom}
              canContinue={!enterRoomDisabled}
            />
          <p className="text-gray-400 my-6 text-md flex items-center justify-center flex-col">
            <button className="hover:text-gray-600 transition-all hover:underline" onClick={() => void goToNewRoom()}>
              Create a new room
            </button>
            { lastRoom !== undefined && (
              <button className="mt-4 hover:text-gray-600 transition-all hover:underline" onClick={() => void goToLastRoom()}>
                ...or go to your last room
              </button>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}
