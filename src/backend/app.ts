import { randomUUID } from "crypto";
import { IncomingMessage } from "http";
import UrlUtils from "url";
import { WebSocket, WebSocketServer } from "ws";
import { Logger } from "../logger";

import { manager } from "./room-manager";
import server from "./server";
import { User } from "./user";

const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", (socket: WebSocket, req: IncomingMessage) => {
  const uid = randomUUID();
  const name = UrlUtils.parse(req.url!, true).query?.name as string | undefined;

  const roomId = UrlUtils.parse(req.url!, true).query?.room as string | undefined;

  if (!name || !roomId) {
    socket.close();
    return;
  }

  const room = manager.getOrCreate(roomId.toUpperCase());
  const user = new User(uid, name, socket);
  Logger.info(`User ${name} has joined room ${roomId.toUpperCase()}`);

  socket.on("message", (data) => {
    Logger.info(`User ${name} has sent a message ${data.toString()}`);
    room.handleMessage(uid, data);
  });

  const onClose = () => {
    Logger.info(`User ${name} has left the room`);
    room.leave(user);
    manager.checkVacancy(room.id);
    room.broadcast();
  };

  socket.on("close", onClose);
  socket.on("error", onClose);
  socket.on("ping", () => socket.pong());

  room.join(user);
  room.broadcast();
});

server.listen(8080, "0.0.0.0", () => {
  Logger.info("Server is listening on port 8080");
});
