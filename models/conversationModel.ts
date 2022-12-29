import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: [true, "matchid is required."],
    unique: true,
  },
  unread: {
    type: {},
  },
  messages: {
    type: [
      {
        message: String,
        from: String,
        to: String,
        createdAt: Date,
      },
    ],
  },
});

type Message = {
  message: string;
  from: string;
  to: string;
  createdAt: Date;
};

export interface Conversation {
  matchId: string;
  messages: Message;
  unread: {
    [key: string]: string[];
  }[];
}

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
