"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const geoSchema = new mongoose_1.default.Schema({
    type: String,
    coordinates: [Number, Number],
});
const imageSchema = new mongoose_1.default.Schema({
    image: String,
    order: Number,
});
const UserSchema = new mongoose_1.default.Schema({
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
    },
    likes: {
        type: [String],
        required: [true, "Likes is required field."],
    },
    dislikes: {
        type: [String],
        required: [true, "Dislikes is required field."],
    },
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
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
