import mongoose from "mongoose";
import User from "./userModel";

const BookingSchema = new mongoose.Schema({
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

export interface IBooking {
  bookedBy: string;
  time: string;
  seat: string;
}

const Booking = mongoose.model("Booking", BookingSchema);

export default Booking;
