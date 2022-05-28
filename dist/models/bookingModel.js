"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const BookingSchema = new mongoose_1.default.Schema({
    bookedBy: {
        type: String,
        required: true,
    },
    time: {
        // string or date
        type: String,
        required: true,
    },
    seat: {
        type: String,
        required: true,
    },
});
const Booking = mongoose_1.default.model("Booking", BookingSchema);
exports.default = Booking;
