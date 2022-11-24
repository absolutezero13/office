import express from "express";
import { getLocationFromCoordinates } from "../controllers/geoController";

const router = express.Router();

router.route("/location").get(getLocationFromCoordinates);

export default router;
