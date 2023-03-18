import { useState } from "preact/hooks";
import { Input } from "components/Input";
import { Button } from "components/Button";
import Axios from "axios";
import { route } from "preact-router";

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

  return (
    <div className="w-full min-h-screen px-3">
      <div className="flex flex-col items-center justify-center mx-auto max-w-4xl w-full min-h-screen">

        <h1 className="text-5xl font-bold my-4">
          Pointing Poker
        </h1>

      <div className="flex flex-col items-center w-full md:w-[320px]">

            <Input
              id="room-code"
              label={"Room code"}
              hideLabel
              value={roomCode}
              onChange={(s) => setRoomCode(s.toUpperCase())}
              placeholder="Enter your room code"
              containerClassName="w-full"
              inputClassName="text-center text-lg"
            />
            <Button
              disabled={enterRoomDisabled}
              class="mt-2 w-full"
              text="Enter room"
              onClick={enterRoom}
            />

          <p className="text-gray-500 my-2 text-sm">
            or
          </p>
          <Button
            class="w-full"
            text="Create a new room"
            onClick={() => void goToNewRoom()}
          />
        </div>

      </div>
    </div>
  );
}
