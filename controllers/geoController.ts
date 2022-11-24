import axios from "axios";
import { Request, Response } from "express";

export const getLocationFromCoordinates = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("query", req.query);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${req.query.lat}+${req.query.lng}&key=${process.env.GEO_API_KEY}`;

    const resp = await axios.get(url);

    res.status(200).json(resp.data);
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
