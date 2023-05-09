import http from "http";
import express from "express";
import path from "path";
import morgan from "morgan";

import { generateRoomId } from "./utils";
import { manager } from "./room-manager";
import { Helmet } from "./headers";

const app = express();
app.use(morgan("common"));
app.use(Helmet);

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

app.get("/:room", (_, res) => {
  res.sendFile("dist/index.html", { root: path.join(__dirname, "..", "..") });
});

app.use((req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile("dist/index.html", { root: path.join(__dirname, "..", "..") });
    return;
  }

  if (req.accepts("json")) {
    res.json({ error: "Not found" });
    return;
  }

  res.type("txt").send("Not found");
});

export default server;
