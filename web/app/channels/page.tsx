"use client";

import { useState, useRef, useEffect } from "react";

export default function ChannelsPage() {
  const currentUser = {
    id: 1,
    username: "kuroyami",
    avatar: "",
    bio: "Fullstack developer",
  };

  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [postText, setPostText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [mockChannels, setMockChannels] = useState<any[]>([
    {
      id: 1,
      title: "Frontend Tips",
      description: "Советы по React/JS/TS",
      author: "kuroyami",
      posts: [
        {
          id: 1,
          author: "kuroyami",
          text: "Первый пост в канале 🎉",
          date: "10:15",
          files: [],
        },
      ],
      subscribers: ["alice", "bob"],
      createdAt: "2025-08-20T10:00:00Z",
    },
    {
      id: 2,
      title: "Game Dev News",
      description: "Новости игровой индустрии",
      author: "alice",
      posts: [],
      subscribers: [],
      createdAt: "2025-08-21T09:00:00Z",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // drag'n'drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Создание поста
  const createPost = () => {
    if ((!postText.trim() && attachedFiles.length === 0) || !selectedChannel)
      return;

    if (selectedChannel.author !== currentUser.username) {
      alert("Постить может только автор канала!");
      return;
    }

    const now = new Date();
    const newPost = {
      id: selectedChannel.posts.length + 1,
      author: currentUser.username,
      text: postText,
      date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      files: attachedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })),
    };

    const updatedChannel = {
      ...selectedChannel,
      posts: [...selectedChannel.posts, newPost],
    };

    setSelectedChannel(updatedChannel);
    setMockChannels((prev) =>
      prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
    );

    setPostText("");
    setAttachedFiles([]);
  };

  // Подписка / отписка
  const toggleSubscribe = () => {
    if (!selectedChannel) return;

    const isSubscribed = selectedChannel.subscribers.includes(
      currentUser.username
    );

    const updatedChannel = {
      ...selectedChannel,
      subscribers: isSubscribed
        ? selectedChannel.subscribers.filter(
            (u: string) => u !== currentUser.username
          )
        : [...selectedChannel.subscribers, currentUser.username],
    };

    setSelectedChannel(updatedChannel);
    setMockChannels((prev) =>
      prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
    );
  };

  // Автопрокрутка
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChannel?.posts]);

  return (
    <div className="relative h-screen w-full flex bg-zinc-700 overflow-hidden">
      {/* Список каналов */}
      <div className="w-1/4 p-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {[...mockChannels]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`flex flex-col p-2 rounded cursor-pointer ${
                  selectedChannel?.id === channel.id
                    ? "bg-zinc-600"
                    : "hover:bg-zinc-600"
                }`}
              >
                <span className="text-white font-bold">{channel.title}</span>
                <span className="text-gray-400 text-sm">
                  Author: {channel.author}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Лента канала */}
      <div className="flex-1 flex flex-col p-1">
        {selectedChannel ? (
          <div className="flex-1 flex flex-col bg-zinc-800 rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-zinc-600">
              <div>
                <span className="font-bold text-white">
                  {selectedChannel.title}
                </span>
                <p className="text-xs text-gray-400">
                  {selectedChannel.description}
                </p>
                <p className="text-xs text-gray-400">
                  Подписчиков: {selectedChannel.subscribers.length}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Кнопка подписки, если не автор */}
                {selectedChannel.author !== currentUser.username && (
                  <button
                    onClick={toggleSubscribe}
                    className="px-3 py-1 bg-green-600 rounded text-white text-sm hover:bg-green-500"
                  >
                    {selectedChannel.subscribers.includes(currentUser.username)
                      ? "Unsubscribe"
                      : "Subscribe"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedChannel(null)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* ПОСТЫ */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {selectedChannel.posts.map((post: any) => (
                <div key={post.id} className="flex flex-col">
                  <div className="px-3 py-2 rounded-xl bg-zinc-600 text-white max-w-lg">
                    <p className="font-bold">{post.author}</p>
                    <p>{post.text}</p>
                    {post.files?.length > 0 && (
                      <div className="mt-1 space-y-1">
                        {post.files.map((file: any, i: number) => (
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
                    <span className="text-xs text-gray-300">{post.date}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Создание поста (только автор) */}
            {selectedChannel.author === currentUser.username && (
              <>
                {attachedFiles.length > 0 && (
                  <div className="p-2 bg-zinc-900 text-white text-sm flex gap-2 flex-wrap">
                    {attachedFiles.map((file, i) => (
                      <div key={i} className="relative">
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

                <div
                  className="p-2 border-t border-zinc-600 flex gap-2"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && createPost()}
                    placeholder="Напишите пост..."
                    className="flex-1 p-2 rounded bg-zinc-900 text-white"
                  />
                  <button
                    onClick={createPost}
                    className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-500"
                  >
                    Post
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Choose channel
          </div>
        )}
      </div>
    </div>
  );
}
