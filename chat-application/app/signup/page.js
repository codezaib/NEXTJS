"use client";
import Signup from "@/components/Signup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useSelector((store) => store.user);
  useEffect(() => {
    if (user && user?.userId) router.replace("/home");
  }, [user]);
  return <Signup />;
}
