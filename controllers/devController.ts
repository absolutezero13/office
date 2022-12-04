import { Request, Response } from "express";
import axios from "axios";
import bcrypt from "bcryptjs";

import User from "../models/userModel";
import { names } from "../helpers/names";
import { randomIntFromInterval } from "../helpers/random";

export const generateUsers = async (req: Request, res: Response) => {
  try {
    await User.deleteMany({});

    const turkeyEndPoint =
      "https://us-central1-tandir-364518.cloudfunctions.net/app";

    const citiesResp = await axios.get(turkeyEndPoint + "/cities");

    const cities = citiesResp.data.data;

    for (let i = 0; i < 200; i++) {
      const birthYear = randomIntFromInterval(1975, 2000);
      const gender = ["male", "female"][randomIntFromInterval(0, 1)];

      const randomCity = cities[randomIntFromInterval(0, 80)];
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
        preferences: {
          distance: 100,
          gender: ["male", "female", "all"][randomIntFromInterval(0, 2)],
          ages: [randomIntFromInterval(20, 40), randomIntFromInterval(41, 80)],
        },
      };

      user.password = await bcrypt.hash(user.password, 10);

      const newUser = await User.create(user);
      console.log("created", newUser.username);
    }

    res.status(200).send({});
  } catch (error) {
    console.log("err?", error);
    res.status(400).send(error);
  }
};
