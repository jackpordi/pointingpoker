/* eslint-disable import/prefer-default-export */
import { IUserState } from './messages';

export class RoomState {
  private users: IUserState[] = [];

  private revealed = false;

  public addUser(id: string, name: string) {
    this.users.push({ id, name, picked: null });
  }

  public removeUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }

  public userPicked(id: string, picked: number | null) {
    this.users.find((u) => u.id === id)!.picked = picked;
  }

  public clearAllPicked() {
    this.users = this.users.map(({ id, name }) => ({ id, name, picked: null }));
    this.revealed = false;
  }

  public reveal() {
    this.revealed = true;
  }

  public serialize() {
    const users = this.revealed
      ? this.users
      : this.users.map(({ id, name, picked }) => ({
        id,
        name,
        picked: picked === null ? null : true,
      }));

    return JSON.stringify({
      revealed: this.revealed,
      users,
    });
  }
}
