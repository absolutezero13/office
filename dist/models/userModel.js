"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
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
    matches: [String],
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
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
