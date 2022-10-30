import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";

export const checkJwt = async (req: Request, res: Response) => {
  const [_, token] = req.headers.authorization?.split(" ");

  try {
    const decoded = jwt.verify(token, "secret");
    console.log("decoded", decoded);

    return true;
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Invalid JWT",
    });

    return false;
  }
};
