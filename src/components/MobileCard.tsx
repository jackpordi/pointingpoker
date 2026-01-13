import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Props {
  name: string;
  points: number | null | true;
  revealed: boolean;
}

export const MobileCard: React.FC<Props> = ({
  name,
  points,
  revealed,
}) => (
  <Card
    className={cn(
      "flex flex-row w-full items-center justify-between px-4 py-3 my-1 min-h-[60px] transition-colors",
      revealed
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-card text-card-foreground border-primary"
    )}
  >
    <div className="font-medium">{name}</div>
    <div className="flex items-center justify-center font-semibold text-lg">
      {points !== null && !revealed && (
        <Check className="h-7 w-7 text-card-foreground" />
      )}
      {typeof points === "number" && revealed && points}
    </div>
  </Card>
);
