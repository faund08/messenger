import mongoose, { Schema, Document } from "mongoose";

export default interface IPost extends Document {
  channelId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  text: string;
  attachments?: { url: string; type: "image" | "pdf" | "video" }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IChannel extends Document {
  name: string;
  authorId: mongoose.Types.ObjectId;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "pdf", "video"], required: true },
});

const PostSchema = new Schema<IPost>(
  {
    channelId: { type: Schema.Types.ObjectId, ref: "Channel", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

const ChannelSchema = new Schema<IChannel>(
  {
    name: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Channel = mongoose.model<IChannel>("Channel", ChannelSchema);
export const Post = mongoose.model<IPost>("Post", PostSchema);
