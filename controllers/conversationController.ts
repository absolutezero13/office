import { Request, Response } from "express";
import Conversation from "../models/conversationModel";

export const getConversation = async (req: Request, res: Response) => {
  try {
    const matchId = req.params.matchId;

    const conversation = await Conversation.findOne({
      matchId,
    });

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const matchId = req.body.matchId;

    const resp = await Conversation.create({
      matchId,
      messages: [],
    });

    res.status(200).json({
      succes: true,
      data: resp,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};

export const pushMessage = async (req: Request, res: Response) => {
  try {
    const resp = await Conversation.updateOne(
      {
        matchId: req.body.matchId,
      },
      {
        $push: { messages: req.body.message },
      }
    );

    res.status(200).json({
      succes: true,
      data: resp,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};
