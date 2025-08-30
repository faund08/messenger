import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  avatarUrl?: string;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    registeredAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);