import { FunctionComponent } from "preact";

interface Props {
  onClick(): void;
  text: string;
  class?: string;
  disabled?: boolean;
}

interface RadioButtonsProps {
  choices: Array<number>;
  revealed: boolean;
  onClick(n: number): void;
}

const Radio: FunctionComponent<Props> = ({
  onClick,
  text,
  disabled = false,
  ...props
}) => (
    <button
      disabled={disabled}
      type="button"
      className={`${props.class!} w-12 h-12 rounded-full transition ease-in-out duration-200 text-black bg-white border-red-400 border-2 font-bold hover:bg-red-200 focus:ring-4 focus:ring-blue font-medium py-2 px-3 py-2 disabled:bg-gray-300`}
      onClick={onClick}
    >
      { text}
    </button>
);

export const RadioButtons: FunctionComponent<RadioButtonsProps> = ({
  choices,
  revealed,
  onClick,
}) => (
    <div className="flex flex-row py-2">
    { choices.map((n) => (
      <Radio
        key={n}
        disabled={revealed}
        class="mx-1"
        onClick={() => onClick(n)}
        text={n.toString()}/>
    ))}
  </div>
);
