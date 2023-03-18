import WebSocket, { RawData } from "ws";
import {
  IdentifyMessage, IncomingMessage, IUser, PongMessage,
} from "types";
import { RoomState } from "./room-state";

export class Room {
  private connections: IUser[] = [];

  private readonly state = new RoomState();

  constructor(
    public readonly id: string,
  ) {
    this.join = this.join.bind(this);
  }

  public get occupants() {
    return this.state.size;
  }

  public join(user: IUser) {
    const { id, name, socket } = user;

    this.connections.push(user);
    this.state.addUser(id, name);

    const payload: IdentifyMessage = {
      type: "Identify",
      id,
    };

    socket.send(JSON.stringify(payload));
  }

  public leave(user: IUser) {
    this.state.removeUser(user.id);
    this.connections = this.connections.filter((conn) => conn.socket !== user.socket);
  }

  public handleMessage(id: string, message: RawData, socket: WebSocket) {
    const parsed: IncomingMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsed.type === "Clear") {
      this.clearChoices();
    } else if (parsed.type === "PointsChosen") {
      this.handleUserChoosePoints(id, parsed.points);
    } else if (parsed.type === "Reveal") {
      this.revealChoices();
    } else if (parsed.type === "Ping") {
      this.pong(socket);
    }

    if (parsed.type !== "Ping") {
      this.broadcast();
    }
  }

  public pong(socket: WebSocket) {
    const pong: PongMessage = {
      type: "Pong",
    };

    socket.send(JSON.stringify(pong));
  }

  public broadcast() {
    const data = this.state.serialize();
    for (const conn of this.connections) {
      const payload = {
        ...data,
        users: data.users.map((u) => {
          if (data.revealed) return u;
          if (u.id === conn.id) return u;

          return {
            ...u,
            picked: u.picked === null ? null : true,
          };
        }),
      };

      conn.socket.send(JSON.stringify(payload));
    }
  }

  public clearChoices() {
    this.state.clearAllPicked();
  }

  public revealChoices() {
    this.state.reveal();
  }

  public handleUserChoosePoints(id: string, points: number | null) {
    this.state.userPicked(id, points);
  }
}
