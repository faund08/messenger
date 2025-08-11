"use client"

export default function ProfileSidebar({ user, onClose }: { user: any; onClose: () => void }) {

    return (
        <div className="fixed right-0 top-0 h-full w-[350px] bg-zinc-900 shadow-lg p-4 z-50">
            <button onClick={onClose} className="text-gray-500 hover:text-black">⨉</button>
            <div className="flex flex-col items-center">
                <img src={user.avatar} alt="" className="w-55 h-55 rounded-full mb-4 "/>
                <h2 className="text-lg fon-bold">{user.username}</h2>
                <p className="text-gray-600">{user.bio}</p>
            </div>
        </div>
    );
}