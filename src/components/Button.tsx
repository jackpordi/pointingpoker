import React from "react";
import { Button as ShadcnButton } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onClick(): void;
  text: string;
  class?: string;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const Button: React.FC<Props> = ({
  onClick,
  text,
  disabled = false,
  class: classProp,
  className,
  variant = "default",
  ...props
}) => (
  <ShadcnButton
    disabled={disabled}
    type="button"
    variant={variant}
    className={cn(classProp, className)}
    onClick={onClick}
    {...props}
  >
    {text}
  </ShadcnButton>
);
