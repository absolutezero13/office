"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const geoRouter_1 = __importDefault(require("./routers/geoRouter"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const { Server: SocketServer } = socket_io_1.default;
const io = new SocketServer(server);
let db = process.env.TEST_DB_NAME;
const mode = process.env.MODE;
if (mode === "prod") {
    db = process.env.PROD_DB_NAME;
}
io.on("connection", (socket) => {
    socket.on("message", (msg, room) => {
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
const DB = (_a = process.env.DB) === null || _a === void 0 ? void 0 : _a.replace("<password>", process.env.DBPASSWORD).replace("<db>", db);
mongoose_1.default
    .connect(DB)
    .then((con) => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.log(err);
});
app.use(express_1.default.json());
app.use(express_1.default.static("public"));
app.use("/users", userRouter_1.default);
app.use("/geo", geoRouter_1.default);
app.get("/", (req, res) => res.send("Hello From the server. This is a test route"));
server.listen(process.env.PORT);
