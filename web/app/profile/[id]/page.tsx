"use client";

import { useParams, useRouter } from "next/navigation";
import ProfileSidebar from "@/components/ProfileSidebar";

export default function ProfilePage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const user = {
    id,
    username: "kuroyami",
    avatar: "/avatar.jpg",
    bio: "Fullstack developer",
  };

  const closeProfile = () => {
    router.back; // или router.back()
  };

  return (
      <ProfileSidebar user={user} onClose={closeProfile} />
  );
}
