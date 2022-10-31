import { Request, Response } from "express";
import User, { IUser } from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { checkJwt } from "../helpers/auth";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../aws/s3";
import crypto from "crypto";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const signUp = async (req: Request, res: Response) => {
  // 2 ways of creating document in mongoose
  // 1-
  // const user: Document = new User({
  //   username,
  //   email,
  //   password,
  //   secretQuestion,
  // });
  //await user.save();

  // 2-

  try {
    const newUserInfo: IUser = req.body;

    newUserInfo.password = await bcrypt.hash(newUserInfo.password, 10);

    const newUser = await User.create(newUserInfo);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    console.log("err", err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      res.status(400).send({
        message: "files required!",
      });
      return;
    }

    const { userId } = req.body;

    for (const file of req?.files as Express.Multer.File[]) {
      const imageName = file.originalname + "-" + crypto.randomUUID();

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      const imageObj = new PutObjectCommand(params);

      await s3.send(imageObj);

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: { pictures: { image: imageName, order: 0 } },
        }
      );
    }

    res.send({
      success: true,
      data: {
        message: "Images Uploaded",
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
    });
  }
};

export const getUserImages = async (req: Request, res: Response) => {
  const user: IUser | null = await User.findById(req.params.id);

  const images = [];

  if (user) {
    for (const imageObj of user?.pictures) {
      const getObjParams = {
        Bucket: process.env.BUCKET_NAME as string,
        Key: imageObj.image,
      };

      const command = new GetObjectCommand(getObjParams);

      const imageUrl = await getSignedUrl(s3, command, {
        expiresIn: 36000,
      });

      images.push(imageUrl);
    }

    res.status(200).json({
      status: "success",
      images,
    });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const userInfo: {
    username: string;
    password: string;
  } = req.body;

  const user = await User.findOne({ username: userInfo.username });

  if (!user) {
    console.log("user not found");
    res.status(404).send({
      status: "fail",
      message: "User not found",
    });

    return;
  }

  const isMatch = await bcrypt.compare(userInfo.password, user.password);

  if (!isMatch) {
    console.log("user not found");

    res.status(400).json({
      status: "fail",
      message: "Wrong password",
    });
    return;
  }
  console.log("success!!");
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    "secret"
  );

  user.password = null;

  res.status(200).json({
    data: {
      token,
      user,
    },
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const resp = await checkJwt(req, res);
    console.log("resp?", resp);

    if (!resp) return;
    console.log("finding users");
    const users: IUser[] = await User.find().select("-password");

    // const users = await User.find({})
    //   .where("username")
    //   .equals(req.query.username);

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

export const getUser = async (req: Request, res: Response) => {
  try {
    const user: IUser | null = await User.findById(req.params.id);

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
