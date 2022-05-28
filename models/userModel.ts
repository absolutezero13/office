import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  secretAnswer: {
    type: String,
    required: [true, "Secret question is required."],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  position: {
    type: String,
    required: [true, "Position is required."],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", UserSchema);

export interface IUser {
  _id: string;
  userName: string;
  email: string;
  password: string;
  secretAnswer: string;
  role: string;
  position: string;
  createdAt: Date;
}

export default User;
