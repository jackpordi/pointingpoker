import { useState } from 'preact/hooks';
import { InputName } from './components/InputName';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Session } from './components/Session';

export function App() {
  const [name, setName] = useState('');

  return (
    <div className="flex flex-col w-full items-center">
      <h1 class="md:text-3xl lg:text-5xl font-bold my-4">
        Planning Poker
      </h1>
      { name ? (
        <Session name={name}/>
      ) : (
      <InputName setName={setName}/>
      )}
    </div>
  );
}