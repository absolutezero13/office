import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter";
import geoRouter from "./routers/geoRouter";
import socket from "socket.io";

const app = express();

const server = http.createServer(app);

const { Server: SocketServer } = socket;
const io = new SocketServer(server);

let db = process.env.TEST_DB_NAME as string;
const mode: "prod" | "dev" = process.env.MODE as "prod" | "dev";
if (mode === "prod") {
  db = process.env.PROD_DB_NAME as string;
}

io.on("connection", (socket) => {
  socket.on("message", (msg: string, room: string) => {
    socket.to(room).emit("receive-message", msg);
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

const DB = process.env.DB?.replace(
  "<password>",
  process.env.DBPASSWORD as string
).replace("<db>", db);

mongoose
  .connect(DB as string)
  .then((con) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/geo", geoRouter);

app.get("/", (req, res) =>
  res.send("Hello From the server. This is a test route")
);

server.listen(process.env.PORT);
