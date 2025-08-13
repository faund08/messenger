import { Message } from './Message';

export interface Conversation {
  id: string;
  participants: string[];
  type: "direct" | "group";
  lastMessage?: Message;
  updatedAt: Date;
}
