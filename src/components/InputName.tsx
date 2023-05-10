import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";
import { InputWithButton } from "./InputWithButton";

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
      <h1 className="hidden text-4xl font-bold my-4">
        { "What's your name?" }
      </h1>
      <div className="flex flex-row items-center">
        <InputWithButton
          label="name"
          hideLabel
          id="name"
          placeholder="What's your name?"
          inputClassName="text-center text-xl font-bold placeholder:font-normal"
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="flex flex-row my-4 items-center justify-center">
        <Button
          class="px-4 mr-2 py-3"
          disabled={disabled}
          onClick={() => join(value, true)}
          text="Observe"
        />
        <Button
          onClick={() => join(value, false)}
          disabled={disabled}
          text="Play"
          class="px-8 py-3"
        />
      </div>
    </>
  );
};
