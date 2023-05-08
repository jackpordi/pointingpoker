import { FunctionComponent } from "preact";
import ConfettiOG from "react-confetti";

interface Props {
  active: boolean;
  loop?: boolean;
}

export const Confetti: FunctionComponent<Props> = ({
  active,
  loop = false,
}) => {
  if (!active) return null;

  return <ConfettiOG
    width={window.innerWidth}
    height={window.innerHeight}
    tweenDuration={10000}
    numberOfPieces={600}
    recycle={loop}
  />;
};
