import { Request, Response } from "express";
import Booking from "../models/bookingModel";

export const getAllBookings = async (req: Request, res: Response) => {
  const bookings = await Booking.find({});

  res.status(200).json({
    status: "success",
    data: bookings,
  });
};
