import express from "express";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message";
import Conversation from "./models/Conversation";
import { connectDB } from "./db";

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  socket.on("join:conversation", async (conversationId) => {
    socket.join(conversationId);
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .lean();
    socket.emit("messages:history", messages);
  });

  socket.on("message:new", async (data) => {
    try {
      // сохраняем сообщение в БД
      const msg = await Message.create({
        conversationId: data.conversationId,
        senderId: data.senderId,
        text: data.text,
        attachments: data.attachments || [],
      });

      // обновляем последнее сообщение в разговоре
      await Conversation.findByIdAndUpdate(data.conversationId, {
        lastMessage: msg._id,
        updatedAt: new Date(),
      });

      // отправляем всем клиентам
      io.to(data.conversationId).emit("message:new", msg);
    } catch (err) {
      console.error(err);
      socket.emit("message:error", "Не удалось сохранить сообщение");
    }
  });

  socket.on("message:edit", async (data) => {
    try {
      const msg = await Message.findByIdAndUpdate(
        data.messageId,
        { text: data.text, updatedAt: new Date() },
        { new: true }
      );
      if (msg) io.to(msg.conversationId.toString()).emit("message:edit", msg);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("message:delete", async (messageId) => {
    try {
      const msg = await Message.findByIdAndDelete(messageId);
      if (msg)
        io.to(msg.conversationId.toString()).emit("message:delete", messageId);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => console.log("user disconnected:", socket.id));
});

server.listen(4000, () =>
  console.log("Socket server running on http://localhost:4000")
);
