import { useState } from "preact/hooks";
import { InputName } from "components/InputName";
import { Session } from "components/Session";
import { FunctionComponent } from "preact";

interface Props {
  roomId: string;
}

export const Room: FunctionComponent<Props> = ({ roomId }) => {
  const [ name, setName ] = useState("");

  if (name) return <Session name={name} id={roomId} />;

  return (
    <div className="flex flex-col w-full items-center min-h-screen justify-center">
      <InputName setName={setName}/>
    </div>
  );
};
