import clsx from "clsx";
import { FunctionComponent } from "preact";
import { ReactComponent as NextButton } from "../assets/arrow-right.svg";

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

const style = clsx(
  "flex flex-row items-center justify-center",
  "text-gray-900 text-sm",
  "focus:border-black outline-none hover:border-black border-b-2 border-gray-600",
  "p-2.5 w-full relative",
  "transition-all duration-300",
);

const buttonStyle = clsx(
  "absolute",
  "top-0 bottom-0 right-4",
);

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
      <div
        className={style}
      >
        <input
          className={clsx(inputClassName, "outline-none")}
          id={id}
          type="text"
          value={value}
          placeholder={placeholder}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
        />
        <button className={buttonStyle}>
          <NextButton
            className="w-6 h-6"
          />
        </button>
      </div>
    </div>
);
