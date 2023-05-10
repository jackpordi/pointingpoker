import { FunctionComponent } from "preact";

interface Props {
  onClick(): void;
  text: string;
  class?: string;
  disabled?: boolean;
}

export const Button: FunctionComponent<Props> = ({
  onClick,
  text,
  disabled = false,
  ...props
}) => (
  <button
      disabled={disabled}
      type="button"
      className={`${props.class!} text-sm md:text-md transition ease-in-out duration-200 text-white bg-indigo-600 hover:bg-indigo-800 focus:ring-4 focus:ring-blue font-medium rounded-full py-3 px-3 disabled:bg-gray-300`}
      onClick={onClick}
    >
      { text }
    </button>
);
