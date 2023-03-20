import clsx from "clsx";
import { FunctionComponent } from "preact";
import { ReactComponent as Tick } from "../assets/tick.svg";

interface Props {
  name: string;
  points: number | null | true;
  revealed: boolean;
}

export const MobileCard: FunctionComponent<Props> = ({
  name,
  points,
  revealed,
}) => (
    <div className={clsx(
      "shadow-lg shadow-gray-400",
      "rounded-lg border-2 border-solid border-red-400",
      "transition-colors ease-in-out duration-300",
      "flex flex-row w-full items-center justify-between px-4 py-1 my-1",
      "min-h-[60px]",
      revealed ? "bg-white  text-red-400" : "bg-red-400 text-white",

    )}>
      <div>
      { name}
      </div>
     <div className={clsx(
       "flex items-center justify-center",
       "font-bold text-lg text-center",
     )}>
       { points !== null && !revealed && <Tick height="28"/>}
       { typeof points === "number" && revealed && points }
     </div>
    </div>
);
