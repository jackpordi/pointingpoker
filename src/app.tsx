import { useEffect, useMemo, useState } from 'preact/hooks';
import { useRoom } from './hooks/useRoom';

export function App() {
  const {
    users, pick, reveal, clear, connected,
  } = useRoom('Firefox');

  return (
    <>
      <h1>Planning Poker</h1>
      { users.map((u) => <div>
        { u.name }
        <span>
        { u.picked === true && 'Picked' }
        { u.picked === null && 'Waiting...' }
        { typeof u.picked === 'number' && u.picked }
        </span>
      </div>)}
    </>
  );
}
