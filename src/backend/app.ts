import { randomUUID } from "crypto";
import { IncomingMessage } from "http";
import UrlUtils from "url";
import { WebSocket, WebSocketServer } from "ws";
import { Logger } from "../logger";

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
  Logger.info(`User ${name} has joined room ${roomId.toUpperCase()}`);

  socket.on("message", (data) => {
    Logger.info(`User ${name} has sent a message ${data.toString()}`);
    room.handleMessage(uid, data, socket);
  });

  socket.on("close", () => {
    Logger.info(`User ${name} has left the room`);
    room.leave(user);
    manager.checkVacancy(room.id);
    room.broadcast();
  });

  room.join(user);
  room.broadcast();
});

server.listen(8080, "0.0.0.0", () => {
  Logger.info("Server is listening on port 8080");
});
