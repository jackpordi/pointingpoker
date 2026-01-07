import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { InputWithButton } from "components/InputWithButton";
import { useLastRoom } from "hooks/useLastRoom";
import { Card, CardContent } from "components/ui/card";
import { Button } from "components/ui/button";

export function Home() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");

  const enterRoomDisabled = roomCode.length < 4;

  const goToNewRoom = async () => {
    const { data } = await Axios.put<{ id: string }>("/api/room");
    const { id } = data;
    navigate(`/${id.toLowerCase()}`);
  };

  const enterRoom = () => {
    navigate(`/${roomCode.toLowerCase()}`);
  };

  const { lastRoom } = useLastRoom();

  const goToLastRoom = useCallback(() => {
    if (lastRoom) navigate(`/${lastRoom[0]}`);
  }, [lastRoom, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Pointing Poker
          </h1>
          <p className="text-muted-foreground">
            Estimate story points with your team
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <InputWithButton
              id="room-code"
              label="Room code"
              hideLabel
              value={roomCode}
              onChange={(s) => setRoomCode(s.toUpperCase())}
              placeholder="Enter your room code"
              onClick={enterRoom}
              canContinue={!enterRoomDisabled}
            />
            <div className="space-y-2 text-center">
              <Button
                variant="link"
                onClick={() => void goToNewRoom()}
                className="text-sm"
              >
                Create a new room
              </Button>
              {lastRoom !== undefined && (
                <Button
                  variant="link"
                  onClick={() => void goToLastRoom()}
                  className="text-sm"
                >
                  Go to your last room
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
