import WebSocket, { RawData } from "ws";
import { IncomingMessage, IUser, PongMessage } from "types";
import { RoomState } from "./room-state";

export class Room {
  private sockets: WebSocket[] = [];

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

    this.sockets.push(socket);
    this.state.addUser(id, name);
  }

  public leave(user: IUser) {
    this.state.removeUser(user.id);
    this.sockets = this.sockets.filter((s) => s !== user.socket);
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
  }

  public pong(socket: WebSocket) {
    const pong: PongMessage = {
      type: "Pong",
    };

    socket.send(JSON.stringify(pong));
  }

  public broadcast() {
    const data = this.state.serialize();
    for (const socket of this.sockets) {
      socket.send(data);
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
