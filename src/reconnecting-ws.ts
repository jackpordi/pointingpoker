import { IncomingMessage, OutgoingMessage } from "types";

import WebSocket from "isomorphic-ws";

interface ReconnectingWsOptions<O = OutgoingMessage> {
  onMessage(_: O): void;
  onOpen(): void;
  onClose(): void;
  url: string;
}

export class ReconnectingWs<O = OutgoingMessage, I = IncomingMessage> {
  private readonly url: string;

  private onMessage: (_: O) => void;

  private onOpen: () => void;

  private onClose: () => void;

  private socket!: WebSocket;

  constructor(config: ReconnectingWsOptions<O>) {
    this.ping = this.ping.bind(this);
    this.onMessage = (o) => config.onMessage(o);
    this.onClose = () => config.onClose();
    this.onOpen = () => config.onOpen();

    this.url = config.url;

    this.onMessageListener = this.onMessageListener.bind(this);
    this.onCloseListener = this.onCloseListener.bind(this);
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener("open", this.onOpen);
    this.socket.addEventListener("close", this.onCloseListener);
    this.socket.addEventListener("message", this.onMessageListener);
  }

  public send(payload: I) {
    this.socket.send(JSON.stringify(payload));
  }

  public cleanup() {
    this.socket.removeEventListener("open", this.onOpen);
    this.socket.removeEventListener("close", this.onClose);
    this.socket.removeEventListener("message", this.onMessageListener);
    this.socket.close();
  }

  private onCloseListener() {
    this.onClose();
    setTimeout(() => this.connect(), 1000);
  }

  private onMessageListener(message: WebSocket.MessageEvent) {
    const parsed = JSON.parse(message.data as string) as O;
    this.onMessage(parsed);
  }

  public ping() {
    this.socket.ping();
  }
}
