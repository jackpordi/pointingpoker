import { randomUUID } from "crypto";
import { IncomingMessage } from "http";
import UrlUtils from "url";
import { WebSocket, WebSocketServer } from "ws";
import { Room } from "./room";
import { manager } from "./room-manager";
import server from "./server";

const websocket = new WebSocketServer({ server, path: "/ws" });

websocket.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const uid = randomUUID();
  const name = UrlUtils.parse(req.url!, true).query?.name as string | undefined;

  const roomId = UrlUtils.parse(req.url!, true).query?.room as string | undefined;

  if (!name || !roomId) {
    socket.close();
    return;
  }

  const room = manager.getOrCreate(roomId.toUpperCase());

  const user = { id: uid, name, socket };
  console.log(`User ${name} has joined room ${roomId.toUpperCase()}`);

  socket.on("message", (data) => {
    room.handleMessage(uid, data, socket);
    console.log(`User ${name} has sent a message ${data.toString()}`);
    room.broadcast();
  });

  socket.on("close", () => {
    console.log(`User ${name} has left the room`);
    room.leave(user);
    manager.checkVacancy(room.id);
    room.broadcast();
  });

  room.join(user);
  room.broadcast();
});

server.listen(8080, "0.0.0.0", () => {
  console.log("Server is listening!");
});
