import clsx from "clsx";
import { FunctionComponent } from "preact";

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

const style = "box-border border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none block w-full p-2.5 hover:border-indigo-400 transition-all duration-300";

export const Input: FunctionComponent<Props> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  containerClassName,
  inputClassName,
  hideLabel = false,
}) => (
    <div
      className={containerClassName}
    >
      <label
        htmlFor={id}
        className={clsx("text-sm font-medium text-gray-900", hideLabel && "hidden")}
      >
        { label }
      </label>
      <input
        className={clsx(style, inputClassName)}
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        onInput={(e) => onChange((e.target as HTMLInputElement).value)}
      />
    </div>
);
