import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button";

interface Props {
  setName(s: string): void;
}
export const InputName: FunctionComponent<Props> = ({
  setName,
}) => {
  const [ value, onChange ] = useState("");
  return (
    <div>
      <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-900">Enter your name</label>
      <div className="flex flex-row">
        <input
          type="text"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Your name"
          value={value}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          required />
        <div className="ml-4">
        <Button onClick={() => setName(value)} text="Confirm"/>
        </div>
      </div>
    </div>
  );
};
