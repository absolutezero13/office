import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const initSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  io.on("connection", (socket) => {
    socket.on("message", (msg: string, room: string, sender: string) => {
      console.log(msg, room, sender);
      socket.to(room).emit("receive-message", { msg, room, sender });
    });
    socket.on("join-room", (room) => {
      socket.join(room);
    });
    socket.on("writing", (room) => {
      socket.to(room).emit("is-writing");
    });
    socket.on("not-writing", (room) => {
      socket.to(room).emit("is-not-writing");
    });
  });
};

export default initSocket;
