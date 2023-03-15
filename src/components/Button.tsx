import { FunctionComponent } from 'preact';

interface Props {
  onClick(): void | Promise<void>;
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
      class={`${props.class} text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-blue font-medium rounded-lg py-2 px-3 py-2 disabled:bg-gray-300`}
      onClick={onClick}
    >
      { text}
    </button>
);
