"use client";
import Login from "@/components/Login";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const { user } = useSelector((store) => store.user);
  useEffect(() => {
    if (user && user?.userId) router.replace("/home");
  }, [user]);
  return <Login />;
}
