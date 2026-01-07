import React, { useCallback } from "react";
import { Input as ShadcnInput } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange(s: string): void;
  hideLabel?: boolean;
  hideButton?: boolean;
  containerClassName?: string;
  inputClassName?: string;
  onClick?: () => void;
  canContinue?: boolean;
}

export const InputWithButton: React.FC<Props> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  containerClassName,
  inputClassName,
  hideLabel = false,
  hideButton = false,
  onClick,
  canContinue,
}) => {
  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onClick && canContinue) {
      onClick();
    }
  }, [onClick, canContinue]);

  return (
    <form className={cn("w-full space-y-2", containerClassName)} onSubmit={onSubmit}>
      {!hideLabel && (
        <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <ShadcnInput
          autoCapitalize="on"
          className={cn(inputClassName)}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {onClick && !hideButton && (
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!canContinue}
            className={cn(
              "absolute right-1",
              !canContinue && "opacity-50"
            )}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
