import http from "http";
import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import geoRouter from "./routers/geoRouter";
import socket from "socket.io";
import conversationRouter from "./routers/conversationRouter";
import initSocket from "./controllers/socketController";

const app = express();

const server = http.createServer(app);

const { Server: SocketServer } = socket;
const io = new SocketServer(server);

let db = process.env.TEST_DB_NAME as string;
const mode: "prod" | "dev" = process.env.MODE as "prod" | "dev";
if (mode === "prod") {
  db = process.env.PROD_DB_NAME as string;
}

initSocket(io);

const DB = process.env.DB?.replace(
  "<password>",
  process.env.DBPASSWORD as string
).replace("<db>", db);

mongoose
  .connect(DB as string)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/geo", geoRouter);
app.use("/conversation", conversationRouter);

app.get("/", (req, res) =>
  res.send("Hello From the server. This is a test route")
);

server.listen(process.env.PORT);
