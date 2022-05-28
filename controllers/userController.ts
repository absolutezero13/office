import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";

export const signIn = async (req: Request, res: Response) => {
  res.status(200).json({
    data: [],
  });
};

export const signUp = async (req: Request, res: Response) => {
  // 2 ways of creating document in mongoose
  // 1-
  // const user: Document = new User({
  //   userName,
  //   email,
  //   password,
  //   secretQuestion,
  // });
  //await user.save();

  // 2-

  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await User.find().select("userName email");

    // const users = await User.find({})
    //   .where("userName")
    //   .equals(req.query.userName);

    res.status(200).json({
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updatedUser, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    res.status(204).json({
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
