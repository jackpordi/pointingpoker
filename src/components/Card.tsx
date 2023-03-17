import { FunctionComponent } from "preact";
import { clsx } from "clsx";
import { ReactComponent as Tick } from "../assets/tick.svg";

interface Props {
  name: string;
  points: number | null | true;
  revealed: boolean;
}
interface InnerCardProps extends Props {
  face: "front" | "back";
}

const InnerCard: FunctionComponent<InnerCardProps> = ({ name, points, face }) => {
  const isBack = face !== "front";
  return <div className={clsx(
    "p-2 h-full w-full",
    "shadow-lg shadow-gray-400",
    "rounded-lg border-4 border-solid border-red-400",
    "transition-colors ease-in-out duration-300",
    isBack ? "bg-white text-red-400" : "bg-red-400 text-white",
    "flex flex-col absolute",
  )} style={{ WebkitBackfaceVisibility: "hidden", backfaceVisibility: "hidden", transform: isBack ? "rotateY(180deg)" : null }}>
     <div className={clsx(
       "flex flex-1 justify-center items-center",
       "font-bold text-lg text-center",
       "mt-4",
     )}>
       { name }
     </div>
     <div className={clsx(
       "flex items-center justify-center",
       "font-bold text-lg text-center",
       "mb-4 min-h-[30px]",
     )}>
       { points !== null && !isBack && <Tick style={{ color: "white" }} height="28"/>}
       { typeof points === "number" && isBack && points }
     </div>
 </div>;
};

export const Card: FunctionComponent<Props> = ({
  name,
  points,
  revealed,
}) => (
  <div className={"h-48 w-32 m-2"} style={{ perspective: "1000px", backgroundColor: "transparent" }}>
    <div style={{
      position: "relative", width: "100%", height: "100%", textAlign: "center", transition: "transform 0.8s", transformStyle: "preserve-3d", transform: revealed ? "rotateY(180deg)" : null,
    }}>
       <InnerCard name={name} points={points} revealed={!revealed} face="front"/>
       <InnerCard name={name} points={points} revealed={revealed} face="back"/>
    </div>
  </div>
);
