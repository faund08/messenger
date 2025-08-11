"use client";

import { useState } from 'react';
import ProfileSidebar from '@/components/ProfileSidebar';

export default function ChatPage() {
  const user = {
    id: 1,
    username: "kuroyami",
    avatar: "",
    bio: "Fullstack developer"
  };

  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openProfile = (user: any) => setSelectedUser(user);
  const closeProfile = () => setSelectedUser(null);

  return (
    <div className="relative h-screen flex">
      <div className="flex-1 bg-gray-100 p-4">
        <div
          onClick={() => openProfile(user)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
          <span>{user.username}</span>
        </div>
      </div>

      {selectedUser && (
        <ProfileSidebar user={selectedUser} onClose={closeProfile} />
      )}
    </div>
  );
}
