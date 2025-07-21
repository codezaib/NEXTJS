"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Home from "@/components/Home";

export default function HomePage() {
  const { user, loading } = useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user.userId) {
      router.push("/"); // redirect back to Welcome if not logged in
    }
  }, [loading, user, router]);

  if (loading)
    return (
      <div className="grid place-content-center h-full w-full">
        <div className="loader"></div>
      </div>
    );

  return <Home user={user} />;
}
