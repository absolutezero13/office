import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: "fail!",
          message: "NOT AUTHORIZED",
        });
      }
    }

    // VALIDATING TOKEN

    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      res.status(401).json({
        status: "fail",
        message: "NOT AUTHORIZED",
      });
    }

    req.body.user = currentUser;
    next();
  } catch (error) {
    res.status(400).json({
      message: "fail",
      error,
    });
  }
};
