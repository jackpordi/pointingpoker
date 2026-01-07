import React from "react";
import { Input as ShadcnInput } from "./ui/input";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange(s: string): void;
  hideLabel?: boolean;
  containerClassName?: string;
  inputClassName?: string;
}

export const Input: React.FC<Props> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  containerClassName,
  inputClassName,
  hideLabel = false,
}) => (
  <div className={cn("space-y-2", containerClassName)}>
    {!hideLabel && (
      <label htmlFor={id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
    )}
    <ShadcnInput
      className={inputClassName}
      id={id}
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);
