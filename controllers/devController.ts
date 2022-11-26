import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { Request, Response } from "express";
import { names } from "../helpers/names";

export const generateUsers = async (req: Request, res: Response) => {
  try {
    const resp = await User.deleteMany({
      _id: { $ne: "63824890e97bc2148676dc40" },
    });

    for (let i = 0; i < 10; i++) {
      const user = {
        username: names[i * 20],
        email: "admin@hotmail.com" + Math.random(),
        password: "12345",
        birthDate: "2000-04-28T14:45:15",
        description: "başka bir gay",
        phoneNumber: "55469060716" + Math.random(),
        pictures: [],
        matches: [],
        likes: [],
        dislikes: [],
        role: "user",
        gender: "male",
        city: "İstanbul",
        county: "Kadıköy",
        geometry: {
          type: "Point",
          coordinates: [99, 100],
        },
      };

      user.password = await bcrypt.hash(user.password, 10);

      const newUser = await User.create(user);
      console.log("created", user.username);
    }

    res.status(200).send({});
  } catch (error) {
    res.status(400).send(error);
  }
};
