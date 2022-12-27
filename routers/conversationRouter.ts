import express from "express";
import {
  createConversation,
  getAllConversations,
  getConversation,
  pushMessage,
} from "../controllers/conversationController";
import { checkJwt } from "../helpers/auth";

const router = express.Router();

router.route("/:matchId").get(checkJwt, getConversation);
router
  .route("/")
  .post(checkJwt, createConversation)
  .get(checkJwt, getAllConversations);
router.post("/message", checkJwt, pushMessage);

export default router;
