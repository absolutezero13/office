import bcrypt from "bcryptjs";
import User from "../models/userModel";
import { Request, Response } from "express";
import { names } from "../helpers/names";
import axios from "axios";

export const generateUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({
      _id: { $ne: "63824890e97bc2148676dc40" },
    });

    const turkeyEndPoint = "https://turkeys-api.herokuapp.com";

    const citiesResp = await axios.get(turkeyEndPoint + "/cities");

    const cities = citiesResp.data.data;

    for (let i = 0; i < 200; i++) {
      const birthYear = Math.floor(Math.random() * 20) + 1980;
      const gender = ["male", "female"][Math.floor(Math.random() * 2)];

      const randomCity = cities[Math.floor(Math.random() * 81)];
      const countiesRes = await axios.get(
        `${turkeyEndPoint}/counties?city=${randomCity.name}`
      );
      const user = {
        username: names[i * 10],
        email: "admin@hotmail.com" + Math.random(),
        password: "12345",
        birthDate: `${birthYear}-04-28T14:45:15`,
        description: `Hello my name is ${
          names[i * 10]
        } and I'm a tandir test user. I don't exist, I only exist in your dreams. You wanker.`,
        phoneNumber: "55469060716" + Math.random(),
        pictures: [],
        matches: [],
        likes: [],
        dislikes: [],
        role: "user",
        gender,
        city: randomCity.name,
        county: countiesRes.data.data[0].name,
        geometry: {
          type: "Point",
          coordinates: [randomCity.geolocation.lon, randomCity.geolocation.lat],
        },
      };

      user.password = await bcrypt.hash(user.password, 10);

      const newUser = await User.create(user);
      console.log("created", user);
    }

    res.status(200).send({});
  } catch (error) {
    res.status(400).send(error);
  }
};
