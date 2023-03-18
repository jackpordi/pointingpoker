import { FunctionComponent } from "preact";

interface Props {
  onClick(): void;
  text: string;
  class?: string;
  disabled?: boolean;
  chosen?: boolean;
}

interface RadioButtonsProps {
  choices: Array<number>;
  revealed: boolean;
  onClick(n: number): void;
  chosen?: number;
}

const Radio: FunctionComponent<Props> = ({
  onClick,
  text,
  disabled = false,
  chosen,
  ...props
}) => (
    <div className="col-span-2 md:col-span-1">
    <button
      disabled={disabled}
      type="button"
      className={`${props.class!} text-red-400 w-12 h-20 rounded-lg transition ease-in-out duration-200 border-red-400 border-2 font-bold ${chosen ? "bg-red-400 text-white" : "hover:bg-red-100 text-black"} focus:ring-4 focus:ring-blue font-medium py-2 px-3 py-2 disabled:opacity-0 enabled:hover:-translate-y-2`}
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
  chosen,
}) => (
    <div className="grid grid-cols-8 gap-y-2 py-2 items-center justify-center">
    { choices.map((n) => (
      <Radio
        key={n}
          chosen={chosen === n}
        disabled={revealed}
        class="mx-1"
        onClick={() => onClick(n)}
        text={n.toString()}/>
    ))}
  </div>
);
