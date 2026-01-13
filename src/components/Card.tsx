import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  name: string;
  points: number | null | true;
  revealed: boolean;
}
interface InnerCardProps extends Props {
  face: "front" | "back";
}

const InnerCard: React.FC<InnerCardProps> = ({ name, points, face }) => {
  const isBack = face !== "front";
  return (
    <Card
      className={cn(
        "h-full w-full flex flex-col absolute transition-colors",
        isBack
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-card-foreground border-primary"
      )}
      style={{
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: isBack ? "rotateY(180deg)" : undefined,
      }}
    >
      <div className="flex flex-1 justify-center items-center font-semibold text-lg text-center mt-4">
        {name}
      </div>
      <div className="flex items-center justify-center font-semibold text-lg text-center mb-4 min-h-[30px]">
        {points !== null && !isBack && (
          <Check className="h-7 w-7 text-card-foreground" />
        )}
        {typeof points === "number" && isBack && points}
      </div>
    </Card>
  );
};

export const DesktopCard: React.FC<Props> = ({
  name,
  points,
  revealed,
}) => (
  <div
    className="h-48 w-32 m-2"
    style={{ perspective: "1000px", backgroundColor: "transparent" }}
  >
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        textAlign: "center",
        transition: "transform 0.8s",
        transformStyle: "preserve-3d",
        transform: revealed ? "rotateY(180deg)" : undefined,
      }}
    >
      <InnerCard name={name} points={points} revealed={!revealed} face="front" />
      <InnerCard name={name} points={points} revealed={revealed} face="back" />
    </div>
  </div>
);
