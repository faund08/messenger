"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setLoading(true);
    const res = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setLoading(false);

    if (data.url) {
      setAvatarUrl(data.url);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
            <span className="text-gray-400">No Avatar</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload Avatar"}
          </button>
        </form>
      </div>
    </div>
  );
}
