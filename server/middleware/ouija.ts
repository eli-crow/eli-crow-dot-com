import { type Server as HTTPServer } from "http";
import { Server as SocketIoServer } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "~/types/ouijaTypes";

class Ouija {
  io: SocketIoServer<ClientToServerEvents, ServerToClientEvents>;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIoServer(httpServer);

    this.io.on("connection", (socket) => {
      socket.on("stroke", (stroke) => socket.broadcast.emit("stroked", stroke));
      socket.on("clear", () => socket.broadcast.emit("cleared"));
    });
  }
}

let ouija: Ouija | null = null;

export default defineEventHandler((event) => {
  //@ts-ignore
  if (!ouija && event.node.req.socket?.server) {
    //@ts-ignore
    ouija = new Ouija(event.node.req.socket?.server);
    console.log("Started socket.io server");
  }
});
