import express from "express";
import { pushMessage } from "../controllers/conversationController";

const router = express.Router();

router.post("/", pushMessage);

export default router;
