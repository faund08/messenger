"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    const storedUserId = localStorage.getItem("user-id");

    if (!storedToken || !storedUserId) {
      router.replace("/login");
      return;
    }

    setCurrentUser({ id: storedUserId });
    setLoading(false);
  }, [router]);

  if (loading) return null; // или спиннер

  const user = {
    id,
    username: "kuroyami",
    avatar: "/avatar.jpg",
    bio: "Fullstack developer",
  };

  const closeProfile = () => {
    router.back();
  };

  const isOwner = currentUser?.id === user.id;

  return <ProfileSidebar user={user} onClose={closeProfile} isOwner={isOwner} />;
}
