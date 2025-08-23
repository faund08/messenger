"use client";

import { useState, useRef, useEffect } from "react";

export default function GroupChatPage() {
  const user = {
    id: 1,
    username: "kuroyami",
    avatar: "",
  };

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [messageText, setMessageText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [mockGroups, setMockGroups] = useState<any[]>([
    {
      id: 1,
      groupName: "Frontend Team",
      avatar: "/default-group.png",
      members: ["kuroyami", "alice", "bob"],
      lastMessage: "Привет команде!",
      date: "2025-08-20 15:45",
      messages: [
        { id: 1, sender: "alice", text: "Привет команде!", date: "15:45", files: [] },
      ],
    },
    {
      id: 2,
      groupName: "Friends",
      avatar: "/default-group.png",
      members: ["kuroyami", "charlie", "dave"],
      lastMessage: "Кто сегодня в сети?",
      date: "2025-08-19 20:10",
      messages: [
        { id: 1, sender: "charlie", text: "Кто сегодня в сети?", date: "20:10", files: [] },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // === Добавление участника ===
  const addMember = () => {
    if (!selectedGroup) return;
    const newMember = prompt("Введите имя нового участника:");
    if (!newMember) return;

    if (selectedGroup.members.includes(newMember)) {
      alert("Этот участник уже есть в группе");
      return;
    }

    const updatedGroup = {
      ...selectedGroup,
      members: [...selectedGroup.members, newMember],
    };

    setSelectedGroup(updatedGroup);
    setMockGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
  };

  // === Удаление участника ===
  const removeMember = () => {
    if (!selectedGroup) return;
    const member = prompt("Введите имя участника для удаления:");
    if (!member) return;

    if (!selectedGroup.members.includes(member)) {
      alert("Такого участника нет в группе");
      return;
    }

    const updatedGroup = {
      ...selectedGroup,
      members: selectedGroup.members.filter((m: string) => m !== member),
    };

    setSelectedGroup(updatedGroup);
    setMockGroups((prev) =>
      prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
    );
  };

  // === Остальной код (отправка сообщений и т.д.) ===
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const sendMessage = () => {
    if ((!messageText.trim() && attachedFiles.length === 0) || !selectedGroup) return;

    const now = new Date();
    const newMsg = {
      id: selectedGroup.messages.length + 1,
      sender: user.username,
      text: messageText,
      date: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      files: attachedFiles.map((f) => ({
        name: f.name,
        type: f.type,
        url: URL.createObjectURL(f),
      })),
    };

    const updatedGroup = {
      ...selectedGroup,
      messages: [...selectedGroup.messages, newMsg],
      lastMessage: messageText || `📎 ${attachedFiles.length} файл(ов)`,
      date: now.toISOString(),
    };

    setSelectedGroup(updatedGroup);
    setMockGroups((prev) =>
      prev.map((group) => (group.id === updatedGroup.id ? updatedGroup : group))
    );

    setMessageText("");
    setAttachedFiles([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedGroup?.messages]);

  return (
    <div className="relative h-screen w-full flex bg-zinc-700 overflow-hidden">
      {/* Список групп */}
      <div className="w-1/4 p-4 overflow-y-auto">
        <div className="flex flex-col gap-2">
          {[...mockGroups]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((group) => (
              <div
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                  selectedGroup?.id === group.id ? "bg-zinc-600" : "hover:bg-zinc-600"
                }`}
              >
                <img src={group.avatar} alt={group.groupName} className="w-8 h-8 rounded-full" />
                <div className="flex-1">
                  <div className="text-white font-medium">{group.groupName}</div>
                  <div className="text-gray-400 text-xs">{group.lastMessage}</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Окно чата */}
      <div className="flex-1 flex flex-col p-1">
        {selectedGroup ? (
          <div className="flex-1 flex flex-col bg-zinc-800 rounded-[20px] overflow-hidden">
            <div className="flex items-center justify-between p-2 border-b border-zinc-600">
              <div className="flex items-center gap-2">
                <img src={selectedGroup.avatar} alt="" className="w-8 h-8 rounded-full" />
                <div>
                  <span className="font-bold text-white">{selectedGroup.groupName}</span>
                  <div className="text-xs text-gray-400">
                    {selectedGroup.members.join(", ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={addMember}
                  className="px-2 py-1 text-xs bg-green-600 rounded hover:bg-green-500 text-white"
                >
                  ➕
                </button>
                <button
                  onClick={removeMember}
                  className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-500 text-white"
                >
                  ➖
                </button>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {selectedGroup.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === user.username ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                      msg.sender === user.username
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-600 text-white"
                    }`}
                  >
                    <p>{msg.text}</p>
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
            Выберите группу
          </div>
        )}
      </div>
    </div>
  );
}
