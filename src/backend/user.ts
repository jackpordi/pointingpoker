import { UID } from "types";
import WebSocket from "ws";

export class User {
  private alive = true;

  constructor(
    public readonly id: UID,
    public readonly name: string,
    public readonly socket: WebSocket,
  ) {
    this.socket.on("pong", () => {
      this.alive = true;
    });
  }

  public get isAlive() {
    return this.alive;
  }

  public ping() {
    this.alive = false;
    this.socket.ping();
  }
}
