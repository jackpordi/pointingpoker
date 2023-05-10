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
      className={`${props.class!} text-sm md:text-md transition ease-in-out duration-300 text-white bg-gray-800 hover:bg-black focus:ring-4 focus:ring-blue font-medium rounded-full disabled:bg-gray-400`}
      onClick={onClick}
    >
      { text }
    </button>
);
