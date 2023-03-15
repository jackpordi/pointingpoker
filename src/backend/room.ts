/* eslint-disable import/prefer-default-export */
import WebSocket, { RawData } from 'ws';
import { IncomingMessage, IUser } from './messages';
import { RoomState } from './room-state';

export class Room {
  private sockets: WebSocket[] = [];

  private readonly state = new RoomState();

  constructor() {
    this.join = this.join.bind(this);
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

  public handleMessage(id: string, message: RawData) {
    const parsed: IncomingMessage = JSON.parse(message.toString());

    if (parsed.type === 'Clear') {
      this.clearChoices();
    } else if (parsed.type === 'PointsChosen') {
      this.handleUserChoosePoints(id, parsed.points);
    } else if (parsed.type === 'Reveal') {
      this.revealChoices();
    }
  }

  public broadcast() {
    const data = this.state.serialize();
    // eslint-disable-next-line no-restricted-syntax
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

  public async handleUserChoosePoints(id: string, points: number | null) {
    this.state.userPicked(id, points);
  }
}
