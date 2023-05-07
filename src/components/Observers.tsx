import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { IObserver } from "types";
import { ReactComponent as ObserveIcon } from "../assets/observe.svg";
import { Button } from "./Button";

interface Props {
  observers: IObserver[];
}

export const Observers: FunctionComponent<Props> = ({
  observers,
}) => {
  const [ show, setShow ] = useState(false);

  if (observers.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setShow(true)}
        className="mt-2 flex flex-row items-center text-gray-600 hover:text-indigo-700 transition-all"
      >
        <ObserveIcon className="w-4 h-4 mr-1" />
        <span>
          { observers.length }
        </span>
      </button>
      <div
          onClick={() => setShow(false)}
        className={`fixed left-0 right-0 top-0 bottom-0 bg-gray-400 flex items-center justify-center duration-300 transition-all ${show ? "bg-opacity-50" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center justify-center px-8 py-4 bg-white rounded-md">
          <h3 className="text-xl font-bold">
            Observers
          </h3>
          { observers.map((o) => (
          <div className="text-lg py-1" key={o.name}>
              { o.name }
            </div>
          ))}
          <Button
            class="mt-4"
            text="Done"
            onClick={() => setShow(false)}
          />
        </div>
      </div>
    </>
  );
};
