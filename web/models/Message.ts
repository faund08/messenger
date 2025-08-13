export interface Attachment {
  id: string;
  url: string;
  type: "image" | "pdf" | "video";
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  attachments?: Attachment[];
  createdAt: Date;
}
