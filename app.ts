import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter";
import geoRouter from "./routers/geoRouter";

const app = express();
dotenv.config();

let db = process.env.TEST_DB_NAME as string;
const mode: "prod" | "dev" = process.env.MODE as "prod" | "dev";
if (mode === "prod") {
  db = process.env.PROD_DB_NAME as string;
}

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

dotenv.config({ path: "./.env" });
app.use(express.json());
app.use(express.static("public"));

app.use("/users", userRouter);
app.use("/geo", geoRouter);
app.get("/", (req, res) =>
  res.send("Hello From the server. This is a test route")
);

app.listen(process.env.PORT);
