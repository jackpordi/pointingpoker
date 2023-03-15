import { FunctionComponent } from "preact";

interface Props {
  name: string;
  points: number | null | true;
}

export const Card: FunctionComponent<Props> = ({ 
  name,
  points,
}) => (
  <div class="h-48 w-32 rounded-lg bg-blue-400 flex flex-col p-2 m-2">
      <div class="flex-1 justify-center items-center flex font-bold text-lg mt-4">
        { name}
      </div>
      <div class="w-full text-center mb-4 min-h-[24px]">
        { points === true && "Chosen" }
        { typeof points === "number" && points }
      </div>
  </div>
);
