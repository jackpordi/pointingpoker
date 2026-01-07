import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface RadioButtonsProps {
  choices: Array<number>;
  revealed: boolean;
  onClick(n: number): void;
  chosen?: number;
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({
  choices,
  revealed,
  onClick,
  chosen,
}) => (
  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 py-4 items-center justify-center">
    {choices.map((n) => (
      <Button
        key={n}
        variant={chosen === n ? "default" : "outline"}
        disabled={revealed}
        onClick={() => onClick(n)}
        className={cn(
          "w-12 h-20 text-base font-semibold transition-all",
          chosen === n && "scale-105",
          !revealed && !chosen && "hover:scale-105 hover:bg-accent",
          revealed && "opacity-50 cursor-not-allowed"
        )}
      >
        {n.toString()}
  </Button>
    ))}
  </div>
);
