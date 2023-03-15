import { randomUUID } from 'crypto';
import { IncomingMessage } from 'http';
import UrlUtils from 'url';
import { WebSocket, WebSocketServer } from 'ws';
import { Room } from './room';
import server from './server';

const websocket = new WebSocketServer({ server });

const room = new Room();

websocket.on('connection', (socket: WebSocket, req: IncomingMessage) => {
  const uid = randomUUID();
  const name = UrlUtils.parse(req.url!, true).query?.name as string | undefined;

  if (!name) {
    socket.close();
    return;
  }

  const user = { id: uid, name, socket };
  console.log(`User ${name} has joined the room`);

  socket.on('message', (data) => {
    room.handleMessage(uid, data);
    console.log(`User ${name} has sent a message ${data.toString()}`);
    room.broadcast();
  });

  socket.on('close', () => {
    console.log(`User ${name} has left the room`);
    room.leave(user);
    room.broadcast();
  });

  room.join(user);
  room.broadcast();
});

server.listen(8080, () => {
  console.log('Server is listening!');
});
