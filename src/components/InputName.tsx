import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import { Input } from "./Input";

interface Props {
  join(name: string, observing: boolean): void;
}

export const InputName: FunctionComponent<Props> = ({
  join,
}) => {
  const [ value, onChange ] = useState("");

  const disabled = value.length === 0;

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
        <Button
          class="mr-2"
          disabled={disabled}
          onClick={() => join(value, false)}
          text="Play"
        />
        <Button
          disabled={disabled}
          onClick={() => join(value, true)}
          text="Observe"
        />
        </div>
      </div>
    </>
  );
};
