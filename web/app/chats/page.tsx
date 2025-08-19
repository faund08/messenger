"use client";

import { useState, useRef, useEffect } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ChatPage() {
  const user = {
    id: 1,
    username: "kuroyami",
    avatar: "",
    bio: "Fullstack developer",
  };

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [mockChats, setMockChats] = useState<any[]>([
    {
      id: 1,
      username: "alice",
      lastMessage: "Привет!",
      date: "2025-08-17 10:15",
      messages: [{ id: 1, sender: "alice", text: "Привет!", date: "10:15" }],
    },
    {
      id: 2,
      username: "bob",
      lastMessage: "Как дела?",
      date: "2025-08-17 09:50",
      messages: [{ id: 1, sender: "bob", text: "Как дела?", date: "09:50" }],
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

  // Отправка сообщения
  const sendMessage = () => {
    if (!messageText.trim() || !selectedChat) return;

    const now = new Date();
    const newMsg = {
      id: selectedChat.messages.length + 1,
      sender: user.username,
      text: messageText,
      date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: messageText,
      date: now.toISOString(), // для сортировки используем ISO
    };

    setSelectedChat(updatedChat);
    setMockChats((prev) =>
      prev.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))
    );

    setMessageText("");
  };

  // Автопрокрутка к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat?.messages]);

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
                onClick={() => setSelectedChat(chat)}
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
                    <p>{msg.text}</p>
                    <span className="text-xs text-gray-300">{msg.date}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Ввод */}
            <div className="p-2 border-t border-zinc-600 flex gap-2">
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
