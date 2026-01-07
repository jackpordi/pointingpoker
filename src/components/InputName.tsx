import React, { useState } from "react";
import { Button } from "./Button";
import { InputWithButton } from "./InputWithButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface Props {
  join(name: string, observing: boolean): void;
  initialName?: string;
  roomName: string;
}

export const InputName: React.FC<Props> = ({
  join,
  roomName,
  initialName = "",
}) => {
  const [value, onChange] = useState(initialName);

  const disabled = value.length === 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">Room: {roomName.toUpperCase()}</CardTitle>
        <CardDescription>What's your name?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputWithButton
          label="name"
          hideLabel
          id="name"
          placeholder="What's your name?"
          inputClassName="text-center text-lg"
          value={value}
          onChange={onChange}
          onClick={() => join(value, false)}
          hideButton
          canContinue={!disabled}
        />
        <div className="flex flex-row gap-2 justify-center">
          <Button
            variant="outline"
            disabled={disabled}
            onClick={() => join(value, true)}
            text="Observe"
          />
          <Button
            disabled={disabled}
            onClick={() => join(value, false)}
            text="Play"
          />
        </div>
      </CardContent>
    </Card>
  );
};
