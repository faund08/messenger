"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileSidebar({
  user: initialUser,
  onClose,
  isOwner,
}: {
  user: any;
  onClose: () => void;
  isOwner: boolean;
}) {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Инициализация только на клиенте
    const savedAvatar = localStorage.getItem("avatarUrl");
    const hydratedUser = {
      ...initialUser,
      avatar: savedAvatar || initialUser.avatar,
    };
    setUser(hydratedUser);
    setUsername(hydratedUser.username);
    setMounted(true);
  }, [initialUser]);

  function deleteCookie(name: string) {
    document.cookie = name + "=; Max-Age=0; path=/";
  }

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("auth-token");
    localStorage.removeItem("token");
    deleteCookie("token");
    setUser(null);
    router.push("/login");
  };

  const handleAvatarClick = () => {
    if (isOwner) fileInputRef.current?.click();
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

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Update failed");

      setUser((prev) => ({ ...prev, username }));
      setPassword("");
      alert("Profile updated!");
    } catch (e) {
      console.error(e);
    }
  };

  if (!mounted || !user) return null;

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
          {isOwner && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm">
              <img
                src="/upload-avatar.svg"
                alt="upload"
                className="h-15 w-15 opacity-75"
              />
            </div>
          )}
        </div>

        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />

        {isOwner ? (
          <>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-lg font-bold text-center mb-2 bg-zinc-800 text-white rounded p-1"
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm text-center mb-2 bg-zinc-800 text-white rounded p-1"
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-700 text-white rounded px-4 py-1"
              onClick={handleSaveProfile}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold">@{user.username}</h2>
            <p className="text-gray-400 mt-2">{user.bio}</p>
          </>
        )}
      </div>

      {isOwner && (
        <div className="mt-auto flex justify-center">
          <button
            className="h-10 w-50 rounded-[30] bg-indigo-500 hover:bg-indigo-700 active:bg-indigo-900"
            onClick={handleLogout}
          >
            Log-out
          </button>
        </div>
      )}
    </div>
  );
}
