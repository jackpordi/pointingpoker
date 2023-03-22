import { RawData } from "ws";
import {
  IdentifyMessage, IncomingMessage,
} from "types";
import { RoomState } from "./room-state";
import { User } from "./user";

const TEN_SECONDS = 10 * 1000;

export class Room {
  private connections: User[] = [];

  private readonly state = new RoomState();

  private timer: NodeJS.Timer;

  constructor(
    public readonly id: string,
  ) {
    this.join = this.join.bind(this);

    this.timer = setInterval(() => {
      this.connections.forEach((u) => {
        if (!u.isAlive) {
          this.leave(u);
          u.socket.terminate();
        }
        u.ping();
      });
    }, TEN_SECONDS);
  }

  public get occupants() {
    return this.state.size;
  }

  public join(user: User) {
    const { id, name, socket } = user;

    this.connections.push(user);
    this.state.addUser(id, name);

    const payload: IdentifyMessage = {
      type: "Identify",
      id,
    };

    socket.send(JSON.stringify(payload));
  }

  public leave(user: User) {
    this.state.removeUser(user.id);
    this.connections = this.connections.filter((conn) => conn.socket !== user.socket);
  }

  public handleMessage(id: string, message: RawData) {
    const parsed: IncomingMessage = JSON.parse(message.toString()) as IncomingMessage;

    if (parsed.type === "Clear") {
      this.clearChoices();
    } else if (parsed.type === "PointsChosen") {
      this.handleUserChoosePoints(id, parsed.points);
    } else if (parsed.type === "Reveal") {
      this.revealChoices();
    }

    this.broadcast();
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

  public cleanup() {
    clearInterval(this.timer);
  }
}
