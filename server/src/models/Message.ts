import mongoose, { Schema, Document } from "mongoose";

export interface IAttachment {
  url: string;
  type: "image" | "file";
  name?: string;
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  attachments?: IAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const AttachmentSchema = new Schema<IAttachment>({
  url: { type: String, required: true },
  type: { type: String, enum: ["image", "file"], required: true },
  name: { type: String },
});

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    attachments: [AttachmentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
