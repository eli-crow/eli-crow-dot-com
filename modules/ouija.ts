import { defineNuxtModule } from "@nuxt/kit";
import type { Server as HTTPServer } from "http";
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

export default defineNuxtModule({
  setup: (_moduleOptions, nuxt) => {
    nuxt.hook("listen", (server) => {
      new Ouija(server);
    });
  },
});
