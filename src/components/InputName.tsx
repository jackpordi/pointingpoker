import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import { Input } from "./Input";

interface Props {
  setName(s: string): void;
}
export const InputName: FunctionComponent<Props> = ({
  setName,
}) => {
  const [ value, onChange ] = useState("");
  return (
    <>
      <h1 className="text-4xl font-bold my-4">
        { "What's your name?" }
      </h1>
      <div className="flex flex-row items-center">
        <Input
          label="name"
          hideLabel
          id="name"
          placeholder="Your name"
          value={value}
          onChange={onChange}
        />
        <div className="ml-1 md:ml-2">
        <Button onClick={() => setName(value)} text="Join"/>
        </div>
      </div>
    </>
  );
};
