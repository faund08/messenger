import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  //user connected
  console.log("user connected:", socket.id);

  //join conversation
  socket.on("join:conversation", (conversationId) => {
    socket.join(conversationId);
  });

  //new message
  socket.on("message:new", (data) => {
    console.log("message:", data);
    socket.to(data.chatId).emit("message:new", data); //send to others
    socket.emit("message:sent", data); //confirm to sender
  });

  //edit
  socket.on("message:edit", (data) => {
    io.to(data.chatId).emit("message:edit", data);
  });

  //delete
  socket.on("message:delete", (id) => {
    io.emit("message:delete", id);
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Socket server running on http://localhost:4000");
});
