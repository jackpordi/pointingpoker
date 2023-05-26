import { Room } from "./room";

type RoomID = string;

class RoomManager {
  private readonly rooms = new Map<RoomID, Room>();

  public getOrCreate(id: RoomID): Room {
    if (this.rooms.has(id)) {
      return this.rooms.get(id)!;
    }

    const room = new Room(id);
    this.rooms.set(id, room);
    return room;
  }

  public hasRoom(id: RoomID) {
    return this.rooms.has(id);
  }

  public checkVacancy(id: RoomID) {
    const room = this.rooms.get(id);

    if (!room) return;

    if (room && room.occupants === 0) {
      room.cleanup();
      this.rooms.delete(id);
    }
  }
}

export const manager = new RoomManager();
