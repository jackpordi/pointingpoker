import clsx from "clsx";
import { FunctionComponent } from "preact";
import { JSXInternal } from "preact/src/jsx";
import { useCallback } from "preact/hooks";
import { ReactComponent as NextButton } from "../assets/arrow-right.svg";

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

const style = clsx(
  "flex flex-row items-center justify-center",
  "text-gray-900 text-sm",
  "focus:border-black outline-none hover:border-black border-b-2 border-gray-400",
  "p-2.5 w-full relative",
  "transition-all duration-300",
);

const buttonStyle = clsx(
  "absolute",
  "top-0 bottom-0 right-4",
);

export const InputWithButton: FunctionComponent<Props> = ({
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
  const onSubmit: JSXInternal.GenericEventHandler<HTMLFormElement> = useCallback((e) => {
    e.preventDefault();
    if (onClick && canContinue) {
      onClick();
    }
  }, [ onClick, canContinue ]);

  return (
      <form
          className={containerClassName}
          onSubmit={onSubmit}
      >
        <label
            htmlFor={id}
            className={clsx("text-sm font-medium text-gray-900", hideLabel && "hidden")}
        >
          {label}
        </label>
        <div
            className={style}
        >
          <input
              autoCapitalize="on"
              className={clsx(inputClassName, "outline-none")}
              id={id}
              type="text"
              value={value}
              placeholder={placeholder}
              onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          />
          {onClick && (

              <button
                  type="submit"
                  disabled={!canContinue}
                  className={clsx(buttonStyle, canContinue ? "text-black" : "text-gray-400", hideButton && "hidden")}
              >
                <NextButton
                    className="w-6 h-6"
                />
              </button>
          )}
        </div>
      </form>
  );
};
