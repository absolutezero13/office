import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/userModel";

export const checkJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Getting token if it exists
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
  console.log(req.headers);
  // res.status(200).json({
  //   status: "succes!",
  // });
  // validate token

  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // // check if user still exists

  // const currentUser = await User.findById(decoded.id);

  // console.log(currentUser);

  // if (!currentUser) {
  //   res.status(401).json({
  //     status: "fail",
  //     message: "NOT AUTHORIZED",
  //   });
  // }

  // check if user changed password after token was issued

  // ACCESS FINALLY

  // req.user = currentUser;
  next();
};
