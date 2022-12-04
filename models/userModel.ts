import mongoose from "mongoose";

const geoSchema = new mongoose.Schema({
  type: String,
  coordinates: [Number, Number],
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
  dislikes: {
    type: [String],
    required: [true, "Dislikes is required field."],
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
  preferences: {
    required: [true, "preferences is required"],
    type: {
      distance: Number,
      gender: String,
      ages: {
        max: Number,
        min: Number,
      },
    },
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
  birthDate: Date | string;
  description: string;
  pictures: { image: string; order: number }[];
  matches: string[];
  likes: string[];
  dislikes: string[];
  role: string;
  createdAt: string;
  city: string;
  county: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  preferences: {
    distance: number;
    gender: string;
    ages: {
      max: number;
      min: number;
    };
  };
}

export default User;
