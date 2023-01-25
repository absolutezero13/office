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
export const getAllConversations = async (req: Request, res: Response) => {
  try {
    const userMatches = req.body.user.matches.map(
      (match: any) => match.matchId
    );
    const conversations = await Conversation.find({
      matchId: {
        $in: userMatches,
      },
    });

    res.status(200).json({
      success: true,
      data: conversations,
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
      unread: {
        [req.body.user.id]: [],
        [req.body.matchedUserId]: [],
      },
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
    let resp = await Conversation.updateOne(
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

export const pushUnreadMessage = async (req: Request, res: Response) => {
  try {
    const prop = `unread.${req.body.user._id}`;
    await Conversation.updateOne(
      {
        matchId: req.body.matchId,
      },
      { $push: { [prop]: req.body.message } }
    );

    const allConversations = await Conversation.find({
      matchId: req.body.matchId,
    });

    res.status(200).json({
      succes: true,
      data: allConversations,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};

export const wipeUnreadMessages = async (req: Request, res: Response) => {
  try {
    console.log("wipe req");
    const prop = `unread.${req.body.user._id}`;
    await Conversation.updateOne(
      {
        matchId: req.body.matchId,
      },
      { $set: { [prop]: [] } }
    );

    const allConversations = await Conversation.find({});

    res.status(200).json({
      succes: true,
      data: allConversations,
    });
  } catch (error) {
    res.send({
      success: false,
      error,
    });
  }
};
