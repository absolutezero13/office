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
  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  birthDate: {
    type: Date,
    required: [true, "Birthdate is required."],
  },
  description: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  matches: [String], // ID REFERENCEP
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
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
  role: string;
  createdAt: Date;
  birthDate: Date;
  description: string;
  profilePicture: string;
  matches: string[];
}

export default User;
