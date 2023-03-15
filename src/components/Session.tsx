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

  return (
    <>
      <div className="flex items-center align-center flex-row">
        { users.map((u) => <Card key={u.id} name={u.name} points={u.picked} />)}
      </div>
      <div className="flex flex-row py-2">
        { choices.map((n) => (
          <Button
            key={n}
            disabled={revealed}
            class="mx-1"
            onClick={() => pick(n)} text={n.toString()} />
        ))}
      </div>
      <div className="flex flex-row py-2">
        <Button class="mx-2" onClick={reveal} text="Reveal" />
        <Button class="mx-2" onClick={clear} text="Clear" />
      </div>
    </>
  );
};
