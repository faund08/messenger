"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSidebar({
  user: initialUser,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  const [user, setUser] = useState(() => {
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("avatarUrl");
      return { ...initialUser, avatar: savedAvatar || initialUser.avatar };
    }
    return initialUser;
  });

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function deleteCookie(name: string) {
  document.cookie = name + "=; Max-Age=0; path=/";
}

const handleLogout = async () => {
  await fetch("/api/logout", { method: "POST" });
  localStorage.removeItem("auth-token");  // ключ из login
  localStorage.removeItem("token");       // на всякий случай
  deleteCookie("token");                   // очистить cookie
  setUser(null);
  router.push("/login");
};


  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUser((prev) => ({ ...prev, avatar: data.url }));
      localStorage.setItem("avatarUrl", data.url);
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-[350px] bg-zinc-900 shadow-lg p-4 z-50 flex flex-col">
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-black flex justify-start"
      >
        ⨉
      </button>

      <div className="flex flex-col items-center">
        <div
          className="relative w-55 h-55 rounded-full overflow-hidden cursor-pointer group mb-4"
          onClick={handleAvatarClick}
        >
          <img
            src={user.avatar || "avatar.jpg"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
            <img
              src="/upload-avatar.svg"
              alt="upload"
              className="h-15 w-15 opacity-75"
            />
          </div>
        </div>

        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />

        <h2 className="text-lg font-bold">@{user.username}</h2>
        <p className="text-gray-400 mt-2">{user.bio}</p>
      </div>

      <div className="mt-auto flex justify-center">
        <button
          className="h-10 w-50 rounded-[30] bg-indigo-500 hover:bg-indigo-700 active:bg-indigo-900"
          onClick={handleLogout}
        >
          Log-out
        </button>
      </div>
    </div>
  );
}
