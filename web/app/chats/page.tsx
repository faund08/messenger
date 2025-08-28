"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import ProfileSidebar from "@/components/ProfileSidebar";
import { set } from "react-hook-form";

export default function ChatPage() {
  const user = {
    id: 1,
    username: "kuroyami",
    avatar: "",
    bio: "Fullstack developer",
  };

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]); // 👈 новое состояние
  const [mockChats, setMockChats] = useState<any[]>([
    {
      id: 1,
      username: "alice",
      lastMessage: "Привет!",
      date: "2025-08-17 10:15",
      messages: [
        { id: 1, sender: "alice", text: "Привет!", date: "10:15", files: [] },
      ],
    },
    {
      id: 2,
      username: "bob",
      lastMessage: "Как дела?",
      date: "2025-08-17 09:50",
      messages: [
        { id: 1, sender: "bob", text: "Как дела?", date: "09:50", files: [] },
      ],
    },
    {
      id: 3,
      username: "charlie",
      lastMessage: "Встречаемся завтра",
      date: "2025-08-16 18:30",
      messages: [],
    },
    {
      id: 4,
      username: "dave",
      lastMessage: "Посмотри проект",
      date: "2025-08-16 12:45",
      messages: [],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const openProfile = (user: any) => setSelectedUser(user);
  const closeProfile = () => setSelectedUser(null);

  // drag'n'drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // send message
  const sendMessage = () => {
    if ((!messageText.trim() && attachedFiles.length === 0) || !selectedChat)
      return;

    const now = new Date();
    const newMsg = {
      id: crypto.randomUUID(), // 👈 уникальный id, стабильный на клиенте
      chatId: selectedChat.id,
      sender: user.username,
      text: messageText,
      date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      files: attachedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })),
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: messageText || `📎 ${attachedFiles.length} files`,
      date: now.toISOString(),
    };

    setSelectedChat(updatedChat);
    setMockChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );

    // send to server
    socketRef.current?.emit("message:new", newMsg);

    setMessageText("");
    setAttachedFiles([]);
  };

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000");

    socketRef.current.on("connect", () => {
      console.log("connected:", socketRef.current?.id);
    });

    socketRef.current.on("message:new", (data) => {
      //updating chat
      setMockChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? { ...chat, messages: [...chat.messages, data] }
            : chat
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

  const editMessage = (messageId: string, newText: string) => {
    if (!selectedChat) return;

    // local update
    const updatedChat = {
      ...selectedChat,
      messages: selectedChat.messages.map((msg: any) =>
        msg.id === messageId ? { ...msg, text: newText } : msg
      ),
    };

    setSelectedChat(updatedChat);
    setMockChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );

    // sending to server
    socketRef.current?.emit("message:edit", {
      chatId: selectedChat.id,
      messageId,
      newText,
    });
  };

  const deleteMessage = (messageId: string) => {
    if (!selectedChat) return;

    const updatedChat = {
      ...selectedChat,
      messages: selectedChat.messages.filter(
        (msg: any) => msg.id !== messageId
      ),
    };

    setSelectedChat(updatedChat);
    setMockChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );

    socketRef.current?.emit("message:delete", {
      chatId: selectedChat.id,
      messageId,
    });
  };

  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.on("message:edit", (data) => {
      setMockChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? {
                ...chat,
                messages: chat.messages.map((msg: any) =>
                  msg.id === data.messageId
                    ? { ...msg, text: data.newText }
                    : msg
                ),
              }
            : chat
        )
      );
    });

    socketRef.current.on("message:delete", (data) => {
      setMockChats((prev) =>
        prev.map((chat) =>
          chat.id === data.chatId
            ? {
                ...chat,
                messages: chat.messages.filter(
                  (msg: any) => msg.id !== data.messageId
                ),
              }
            : chat
        )
      );
    });
  }, []);

  return (
    <div className="relative h-screen w-full flex bg-zinc-700 overflow-hidden">
      {/* Список чатов */}
      <div className="w-1/4 p-4 overflow-y-auto">
        {/* <div 
          onClick={() => openProfile(user)}
          className="flex items-center gap-2 cursor-pointer mb-4"
        >
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <span>{user.username}</span>
        </div> */}

        <div className="flex flex-col gap-2">
          {[...mockChats]
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  socketRef.current?.emit("join:conversation", chat.id);
                }}
                className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                  selectedChat?.id === chat.id
                    ? "bg-zinc-600"
                    : "hover:bg-zinc-600"
                }`}
              >
                <span className="text-white">{chat.username}</span>
                <span className="text-gray-400 text-sm">
                  {chat.lastMessage}
                </span>
                <span className="text-gray-400 text-xs ml-2">
                  {new Date(chat.date).toLocaleString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Окно чата */}
      <div className="flex-1 flex flex-col p-1">
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-zinc-800 rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-zinc-600">
              <span className="font-bold text-white">
                {selectedChat.username}
              </span>
              <button
                onClick={() => setSelectedChat(null)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                ✖
              </button>
            </div>

            {/* СООБЩЕНИЯ */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {selectedChat.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === user.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                      msg.sender === user.username
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-600 text-white"
                    }`}
                  >
                    {editingMessageId === msg.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => {
                          editMessage(msg.id, editingText);
                          setEditingMessageId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            editMessage(msg.id, editingText);
                            setEditingMessageId(null);
                          } else if (e.key === "Escape") {
                            setEditingMessageId(null);
                          }
                        }}
                        autoFocus
                        className="p-1 rounded bg-zinc-700 text-white w-full"
                      />
                    ) : (
                      <p>{msg.text}</p>
                    )}

                    {msg.files?.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {msg.files.map((file: any, i: number) => (
                          <div key={i}>
                            {file.type?.startsWith("image/") ? (
                              <img
                                src={file.url}
                                alt={file.name}
                                className="max-w-[200px] rounded"
                              />
                            ) : (
                              <div className="text-xs text-gray-300 flex items-center gap-1">
                                📎 {file.name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Кнопки редактирования и удаления */}
                    {msg.sender === user.username &&
                      editingMessageId !== msg.id && (
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => {
                              setEditingMessageId(msg.id);
                              setEditingText(msg.text);
                            }}
                            className="text-xs text-yellow-400 hover:text-yellow-300"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            🗑
                          </button>
                        </div>
                      )}

                    <span className="text-xs text-gray-300">{msg.date}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Прикрепленные файлы */}
            {attachedFiles.length > 0 && (
              <div className="p-2 bg-zinc-900 text-white text-sm flex gap-2 flex-wrap">
                {attachedFiles.map((file, i) => (
                  <div key={i} className="relative">
                    {/* Если файл картинка — показываем превью */}
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <span className="px-2 py-1 bg-zinc-700 rounded inline-block">
                        📎 {file.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Ввод */}
            <div
              className="p-2 border-t border-zinc-600 flex gap-2"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Введите сообщение..."
                className="flex-1 p-2 rounded bg-zinc-900 text-white"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
              >
                Отправить
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Choose chat
          </div>
        )}
      </div>

      {/* {selectedUser && (
        <ProfileSidebar user={selectedUser} onClose={closeProfile} />
      )} */}
    </div>
  );
}
