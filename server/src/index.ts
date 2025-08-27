
import express from "express";
import http from "http";
import { Server } from "socket.io";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    }
});

io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    //new message
    socket.on("message:new", (data) => {
        console.log("message:", data);
        io.emit("message:new", data);
    });

    //edit
    socket.on("message:edit", (data) => {
        io.emit("message:edit", data);
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
})