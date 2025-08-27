
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(onMessage: (msg: any) => void) {
    
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:4000");

        socketRef.current.on("connect", () => {
            console.log("connected:", socketRef.current?.id);
        });

        socketRef.current.on("message:new", (msg) => {
            onMessage(msg);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [onMessage]);

    const sendMessage = (msg: any) => {
        socketRef.current?.emit("message:new", msg);
    };

    return { sendMessage };
}
