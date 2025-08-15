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

  const openProfile = (user: any) => setSelectedUser(user);
  const closeProfile = () => setSelectedUser(null);

  // Моковые данные чатов
  const mockChats = [
    { id: 1, username: "alice", lastMessage: "Привет!" },
    { id: 2, username: "bob", lastMessage: "Как дела?" },
    { id: 3, username: "charlie", lastMessage: "Встречаемся завтра" },
    { id: 4, username: "dave", lastMessage: "Посмотри проект" },
  ];

  return (
    <div className="relative h-screen w-85 flex bg-zinc-700">
      <div className="flex-1 p-4">

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
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              className="flex items-center justify-between p-2 rounded hover:bg-zinc-600 cursor-pointer"
            >
              <span className="text-white">{chat.username}</span>
              <span className="text-gray-400 text-sm">{chat.lastMessage}</span>
            </div>
          ))}
        </div>
      </div>


            {/* И ЭТУ ЧАСТЬ ТУДА ЖЕ */}
      {/* {selectedUser && (
        <ProfileSidebar user={selectedUser} onClose={closeProfile} />
      )} */}
    </div>
  );
}
