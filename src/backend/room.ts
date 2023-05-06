import { RawData } from "ws";
import {
  IdentifyMessage, IncomingMessage, StateMessage,
} from "types";
import { RoomState } from "./room-state";
import { User } from "./user";

const TEN_SECONDS = 10 * 1000;

export class Room {
  private players: User[] = [];

  private observers: User[] = [];

  private readonly state = new RoomState();

  private timer: NodeJS.Timer;

  constructor(
    public readonly id: string,
  ) {
    this.join = this.join.bind(this);

    this.timer = setInterval(() => {
      this.players.forEach(this.checkUserAlive);
      this.observers.forEach(this.checkUserAlive);
    }, TEN_SECONDS);
  }

  public get occupants() {
    return this.state.size + this.observers.length;
  }

  public checkUserAlive(u: User) {
    if (!u.isAlive) {
      this.leave(u);
      u.socket.terminate();
    }
    u.ping();
  }

  public join(user: User) {
    const { id, name, socket } = user;

    this.players.push(user);
    this.state.addUser(id, name);

    const payload: IdentifyMessage = {
      type: "Identify",
      id,
    };

    socket.send(JSON.stringify(payload));
  }

  public observe(user: User) {
    const { id, socket } = user;

    this.observers.push(user);

    const payload: IdentifyMessage = {
      type: "Identify",
      id,
    };

    socket.send(JSON.stringify(payload));
  }

  public leave(user: User) {
    this.state.removeUser(user.id);
    this.players = this.players.filter((conn) => conn.socket !== user.socket);
    this.observers = this.observers.filter((conn) => conn.socket !== user.socket);
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

    const observers = this.observers.map((o) => ({
      name: o.name,
    }));

    for (const conn of this.players) {
      const payload: StateMessage = {
        ...data,
        users: data.users.map((u) => {
          if (data.revealed) return u;
          if (u.id === conn.id) return u;

          return {
            ...u,
            picked: u.picked === null ? null : true,
          };
        }),
        observers,
      };

      conn.socket.send(JSON.stringify(payload));
    }

    const observerPayload: StateMessage = {
      ...data,
      observers,
    };

    for (const conn of this.observers) {
      conn.socket.send(JSON.stringify(observerPayload));
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
