import mongoose from "mongoose";

const geoSchema = new mongoose.Schema({
  type: String,
  geometry: [Number, Number],
});

const imageSchema = new mongoose.Schema({
  image: String,
  order: Number,
});

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required."],
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
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required."],
    unique: true,
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
  pictures: {
    type: [imageSchema],
    required: [true, "Pictures is required."],
  },
  matches: {
    type: [String],
    required: [true, "Matches is required field"],
  }, // ID REFERENCES,
  likes: {
    type: [String],
    required: [true, "Likes is required field."],
  }, // ID REFERENCES
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  city: {
    type: String,
    required: [true, "city is required"],
  },
  county: {
    type: String,
    required: [true, "county is required"],
  },
  geometry: {
    type: geoSchema,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", UserSchema);

export interface IUser {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword?: string;
  gender: string;
  birthDate: string;
  description: string;
  profilePicture: string;
  matches: string[];
  likes: string[];
  role: string;
  createdAt: string;
}

export default User;
