import { FunctionComponent } from 'preact';
import { useRoom } from '../hooks/useRoom';
import { Button } from './Button';
import { Card } from './Card';

interface Props {
  name: string;
}

const choices = [0, 1, 2, 3, 5, 8, 20, 40];

export const Session: FunctionComponent<Props> = ({
  name,
}) => {

  const {
    users, pick, reveal, clear, revealed,
  } = useRoom(name);

  console.log(revealed);
  return (
    <>
      <div class="flex items-center align-center flex-row">
        { users.map((u) => <div>
          <Card name={u.name} points={u.picked} />
        </div>)}
      </div>
      <div class="flex flex-row py-2">
        { choices.map((n) => (
          <Button
            disabled={revealed}
            class="mx-1"
            onClick={() => pick(n)} text={n.toString()} />
        ))}
      </div>
      <div class="flex flex-row py-2">
        <Button class="mx-2" onClick={reveal} text="Reveal" />
        <Button class="mx-2" onClick={clear} text="Clear" />
      </div>
    </>
  );
};
