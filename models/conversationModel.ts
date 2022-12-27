import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: [true, "matchid is required."],
    unique: true,
  },
  unread: [
    {
      userId: String,
      messages: [String],
    },
  ],
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
    userId: string;
    messages: string[];
  }[];
}

const Conversation = mongoose.model("Conversation", ConversationSchema);

export default Conversation;
