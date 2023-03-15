import WebSocket from 'ws';

type UID = string;

export interface IUserState {
  id: UID;
  name: string;
  picked: number | null | true;
}

export interface IUser {
  id: UID;
  socket: WebSocket;
  name: string;
}

export type IncomingMessage =
  | PointsChosenMessage
  | RevealMessage
  | ClearMessage;

export interface OutgoingMessage extends WSMessage<'State'> {
  state: {
    id: string;
    name: string;
    picked: true | null | number;
  }
}

interface WSMessage<T extends string> {
  type: T;
}

export interface NewJoinerMessage extends WSMessage<'NewJoiner'> {
  name: string;
}

type UserState = Record<string, IUser>;

export interface RevealStatusMessage extends WSMessage<'Status'> {
  state: UserState;
}

export interface OtherUserPickedMessage extends WSMessage<'OtherUserPicked'> {
  id: string;
}

export interface PointsChosenMessage extends WSMessage<'PointsChosen'> {
  points: number | null;
}

export interface RevealMessage extends WSMessage<'Reveal'> {}

export interface ClearMessage extends WSMessage<'Clear'> {}
