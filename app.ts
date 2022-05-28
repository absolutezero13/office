import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import userRouter from "./routers/userRouter";
import bookingRouter from "./routers/bookingRouter";

const app = express();
dotenv.config();

const DB = process.env.DB?.replace(
  "<PASSWORD>",
  process.env.DBPASSWORD as string
);

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
app.use("/bookings", bookingRouter);

app.listen(process.env.PORT);
