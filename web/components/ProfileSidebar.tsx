import React, { useEffect, useRef, useState } from 'react';

export default function ProfileSidebar({ user: initialUser, onClose }: { user: any; onClose: () => void }) {
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedAvatar = localStorage.getItem('avatarUrl');
            return { ...initialUser, avatar: savedAvatar || initialUser.avatar };
        }
        return initialUser;
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await fetch('/api/upload-avatar', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();

            setUser(prev => ({ ...prev, avatar: data.url }));
            localStorage.setItem('avatarUrl', data.url);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed right-0 top-0 h-full w-[350px] bg-zinc-900 shadow-lg p-4 z-50">
            <button onClick={onClose} className="text-gray-500 hover:text-black">⨉</button>
            <div className="flex flex-col items-center">
                <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-55 h-55 rounded-full mb-4 cursor-pointer"
                    onClick={handleAvatarClick}
                />
                <input
                    type="file"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                />
                <h2 className="text-lg font-bold">{user.username}</h2>
                <p className="text-gray-600">{user.bio}</p>
            </div>
        </div>
    );
}
