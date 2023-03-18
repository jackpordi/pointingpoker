import http from "http";
import express from "express";
import path from "path";
import { generateRoomId } from "./utils";
import { manager } from "./room-manager";

const app = express();

app.use(express.static("dist"));

const server = http.createServer(app);

app.put("/api/room", (_, res) => {
  const roomId = generateRoomId();
  if (!manager.hasRoom(roomId)) {
    res.json({ id: roomId });
  } else {
    res.json({ id: generateRoomId() });
  }
});

app.get("/:room", (req, res) => {
  res.sendFile("dist/index.html", { root: path.join(__dirname, "..", "..") });
});

export default server;
