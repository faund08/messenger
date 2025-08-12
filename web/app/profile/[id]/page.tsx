"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth-token");
    if (!storedToken) {
      router.replace("/login");
    } else {
      setToken(storedToken);
      setLoading(false);
    }
  }, [router]);

  if (loading) return null; // Или спиннер

  const user = {
    id,
    username: "kuroyami",
    avatar: "/avatar.jpg",
    bio: "Fullstack developer",
  };

  const closeProfile = () => {
    router.back();
  };

  return <ProfileSidebar user={user} onClose={closeProfile} />;
}
