import express from "express";
import {
  createConversation,
  getConversation,
  pushMessage,
} from "../controllers/conversationController";

const router = express.Router();

router.route("/:matchId").get(getConversation);
router.route("/").post(createConversation);
router.post("/message", pushMessage);

export default router;
