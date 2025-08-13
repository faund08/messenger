import { Attachment } from "discord.js";

export interface Post {
  id: string;
  cnahhelId: string;
  authorId: string;
  text: string;
  createdAt: Date;
  attachments?: Attachment[];
}

export interface Channel {
  id: string;
  name: string;
  authorId: string;
  description?: string;
  posts?: Post[];
  createdAt: Date;
}
