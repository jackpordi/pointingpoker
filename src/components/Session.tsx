import { FunctionComponent } from "preact";
import { useRoom } from "../hooks/useRoom";
import { Button } from "./Button";
import { Card } from "./Card";
import { RadioButtons } from "./CircleButton";

interface Props {
  name: string;
}

const choices = [ 0, 1, 2, 3, 5, 8, 20, 40 ];

export const Session: FunctionComponent<Props> = ({
  name,
}) => {
  const {
    users, pick, reveal, clear, revealed,
  } = useRoom(name);

  return (
    <>
      <div className="flex items-center align-center flex-row">
        { users.map((u) => <Card key={u.id} name={u.name} points={u.picked} revealed={revealed}/>)}
      </div>
      <RadioButtons
        choices={choices}
        revealed={revealed}
        onClick={pick}
      />
      <div className="flex flex-row py-2">
        <Button class="mx-2" onClick={clear} text="Clear" />
        <Button class="mx-2" onClick={reveal} text="Reveal" />
      </div>
    </>
  );
};
