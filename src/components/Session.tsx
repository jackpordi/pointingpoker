import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { useRoom } from "../hooks/useRoom";
import { Button } from "./Button";
import { DesktopCard } from "./Card";
import { RadioButtons } from "./RadioButtons";
import { ReactComponent as ClipboardIcon } from "../assets/clipboard.svg";
import { MobileCard } from "./MobileCard";

interface Props {
  id: string;
  name: string;
}

const choices = [ 0, 1, 2, 3, 5, 8, 20, 40 ];

export const Session: FunctionComponent<Props> = ({
  id,
  name,
}) => {
  const {
    users, pick, reveal, clear, revealed, chosen,
  } = useRoom(id, name);

  const [ linkCopied, setLinkCopied ] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 3000);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">

      <button onClick={copyLink} className="my-2 text-blue-500 hover:underline flex flex-row items-center">
        <ClipboardIcon className="w-4 h-4 mr-1" />
        { linkCopied ? "Link copied!" : "Copy Invite Link"}
      </button>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="hidden md:flex items-center align-center flex-row">
          {
            users.map((u) => <DesktopCard
              key={u.id}
              name={u.name}
              points={u.picked}
              revealed={revealed}/>)
          }
        </div>
        <div className="md:hidden w-screen flex flex-col px-2 my-2">
          {
            users.map((u) => <MobileCard
              key={u.id}
              name={u.name}
              points={u.picked}
              revealed={revealed}/>)
          }
        </div>
        <RadioButtons
          chosen={chosen}
          choices={choices}
          revealed={revealed}
          onClick={pick}
        />
        <div className="flex flex-row py-2">
          <Button class="mx-2" onClick={clear} text="Clear" />
          <Button class="mx-2" onClick={reveal} text="Reveal" />
        </div>
      </div>
    </div>
  );
};
