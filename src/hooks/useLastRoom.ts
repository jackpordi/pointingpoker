import { useCallback, useState } from "preact/hooks";

type ILastRoom = [ string, string];

interface ILastRoomResult {
  /**
   * Room ID, followed by name
   */
  lastRoom?: ILastRoom;
  setLastRoom(roomId: string, name: string): void;
}

function getLastRoomFromLocalStorage(): undefined | ILastRoom {
  const raw = localStorage.lastRoom as string | undefined;

  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as ILastRoom;
    if (Array.isArray(parsed)
      && typeof parsed[0] === "string"
      && typeof parsed[0] === "string") {
      return parsed;
    }
    throw Error();
  } catch {
    delete localStorage.lastRoom;
    return undefined;
  }
}

export function useLastRoom(): ILastRoomResult {
  const [ lastRoom, setLastRoomState ] = useState(getLastRoomFromLocalStorage);

  const setLastRoom = useCallback((...newRoom: ILastRoom) => {
    localStorage.lastRoom = JSON.stringify(newRoom);
    setLastRoomState(newRoom);
  }, [ setLastRoomState ]);

  return {
    lastRoom,
    setLastRoom,
  };
}
