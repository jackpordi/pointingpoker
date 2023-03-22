import { User } from "backend/user";

export type UID = string;

export interface IUserState {
  id: UID;
  name: string;
  picked: number | null | true;
}

export type IncomingMessage =
  | PointsChosenMessage
  | RevealMessage
  | ClearMessage
  | PingMessage;

export type OutgoingMessage = StateMessage | PongMessage | IdentifyMessage;

export type PongMessage = WSMessage<"Pong">;

export interface StateMessage extends WSMessage<"State"> {
  revealed: boolean;
  users: {
    id: string;
    name: string;
    picked: true | null | number;
  }[];
}

interface WSMessage<T extends string> {
  type: T;
}

type UserState = Record<string, User>;

export interface RevealStatusMessage extends WSMessage<"Status"> {
  state: UserState;
}

export interface OtherUserPickedMessage extends WSMessage<"OtherUserPicked"> {
  id: string;
}

export interface PointsChosenMessage extends WSMessage<"PointsChosen"> {
  points: number | null;
}

export interface IdentifyMessage extends WSMessage<"Identify"> {
  id: string;
}

export type RevealMessage = WSMessage<"Reveal">;

export type ClearMessage = WSMessage<"Clear">;

export type PingMessage = WSMessage<"Ping">;
