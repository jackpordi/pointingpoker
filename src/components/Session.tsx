import React, { useState } from "react";
import { useRoom } from "../hooks/useRoom";
import { Button } from "./ui/button";
import { DesktopCard } from "./Card";
import { RadioButtons } from "./RadioButtons";
import { Clipboard, Check } from "lucide-react";
import { MobileCard } from "./MobileCard";
import { Observers } from "./Observers";
import { Confetti } from "./Confetti";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  observing: boolean;
}

const choices = [0, 1, 2, 3, 5, 8, 13, 20];

export const Session: React.FC<Props> = ({
  id,
  name,
  observing,
}) => {
  const {
    users,
    pick,
    reveal,
    clear,
    revealed,
    chosen,
    observers,
    consensus,
  } = useRoom(id, name, observing);

  const [linkCopied, setLinkCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 space-y-6">
      <Confetti active={consensus} />
      
      <Button
        variant="outline"
        onClick={copyLink}
        className="mt-4"
      >
        {linkCopied ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Link copied!
          </>
        ) : (
          <>
            <Clipboard className="mr-2 h-4 w-4" />
            Copy Invite Link
          </>
        )}
      </Button>

      {users.length === 0 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No players in the room</CardTitle>
            <CardDescription>
              Invite players or re-join as a player
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!!users.length && (
        <>
          <div className="hidden md:flex items-center justify-center flex-wrap gap-4">
            {users.map((u) => (
              <DesktopCard
                key={u.id}
                name={u.name}
                points={u.picked}
                revealed={revealed}
              />
            ))}
          </div>
          <div className="md:hidden w-full max-w-md space-y-2">
            {users.map((u) => (
              <MobileCard
                key={u.id}
                name={u.name}
                points={u.picked}
                revealed={revealed}
              />
            ))}
          </div>
        </>
      )}

      {!observing && (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Choose Your Points</CardTitle>
            <CardDescription>
              Select your estimate for this story
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioButtons
              chosen={chosen}
              choices={choices}
              revealed={revealed}
              onClick={pick}
            />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-row gap-2">
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
        <Button onClick={reveal}>
          Reveal
        </Button>
      </div>

      <Observers observers={observers} />
    </div>
  );
};
