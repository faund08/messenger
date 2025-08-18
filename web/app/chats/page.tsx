"use client";

import { useState } from "react";
import ProfileSidebar from "@/components/ProfileSidebar";
//ИМПОРТИРОВАТЬ СЮДА КОМПОНЕНТ С ПАНЕЛЬЮ ИНСТРУМЕНТОВ

export default function ChatPage() {
  const user = {
    id: 1,
    username: "kuroyami",
    avatar: "",
    bio: "Fullstack developer",
  };

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);

  const openProfile = (user: any) => setSelectedUser(user);
  const closeProfile = () => setSelectedUser(null);

  // Моковые данные чатов
  const mockChats = [
    {
      id: 1,
      username: "alice",
      lastMessage: "Привет!",
      date: "2025-08-17 10:15",
    },
    {
      id: 2,
      username: "bob",
      lastMessage: "Как дела?",
      date: "2025-08-17 09:50",
    },
    {
      id: 3,
      username: "charlie",
      lastMessage: "Встречаемся завтра",
      date: "2025-08-16 18:30",
    },
    {
      id: 4,
      username: "dave",
      lastMessage: "Посмотри проект",
      date: "2025-08-16 12:45",
    },
  ];

  return (
    <div className="relative h-screen w-full flex bg-zinc-700 overflow-hidden">
      {/* Список чатов */}
      <div className="w-1/4 p-4 overflow-y-auto">
        {/* ПЕРЕКИНУТЬ ЭТУ ЧАСТЬ КОДА В КОМПОНЕНТ С ПАНЕЛЬЮ ИНСТРУМЕНТОВ
                И ИМПОРТИРОВАННЫЙ КОД ВСТАВИТЬ СЮДА*/}
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
                <span className="text-gray-400 text-xs ml-2">{chat.date}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Окно чата */}
      <div className="flex-1 flex flex-col p-1">
        {selectedChat ? (
          <div className="flex-1 flex flex-col bg-zinc-800 rounded-20px] overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-zinc-600">
              <span className="font-bold text-white">
                {selectedChat.username}
              </span>
              <button
                onClick={() => setSelectedChat(null)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Закрыть
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <p className="text-gray-300">Чат с {selectedChat.username}</p>
              {/* Тут можно отрисовать сообщения */}
            </div>
            <div className="p-2 border-t border-zinc-600">
              <input
                type="text"
                placeholder="Введите сообщение..."
                className="w-full p-2 rounded bg-zinc-900 text-white"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Выберите чат слева
          </div>
        )}
      </div>

      {/* И ЭТУ ЧАСТЬ ТУДА ЖЕ */}
      {/* {selectedUser && (
        <ProfileSidebar user={selectedUser} onClose={closeProfile} />
      )} */}
    </div>
  );
}
