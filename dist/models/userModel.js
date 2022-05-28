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
const User = mongoose_1.default.model("User", UserSchema);
exports.default = User;
