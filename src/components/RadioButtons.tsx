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
    <div className="col-span-2 md:col-span-1">
    <button
      disabled={disabled}
      type="button"
      className={`${props.class!} text-red-400 w-12 h-20 rounded-lg transition ease-in-out duration-200 text-black bg-white border-red-400 border-2 font-bold hover:bg-red-100 focus:ring-4 focus:ring-blue font-medium py-2 px-3 py-2 disabled:opacity-0 enabled:hover:-translate-y-2`}
      onClick={onClick}
    >
      { text}
    </button>
    </div>
);

export const RadioButtons: FunctionComponent<RadioButtonsProps> = ({
  choices,
  revealed,
  onClick,
}) => (
    <div className="grid grid-cols-8 gap-y-2 py-2 items-center justify-center">
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
