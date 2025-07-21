"use client";
import FriendsList from "@/components/Friends";
import { useRouter } from "next/navigation";

export default function FriendsPage() {
  const router = useRouter();
  return <FriendsList />;
}
