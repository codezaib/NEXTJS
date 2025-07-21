"use client";
import Welcome from "@/components/Welome";
import { fetchCurrentUser } from "@/features/User";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Page() {
  const { loading } = useSelector((store) => store.user);

  if (loading)
    return (
      <div className="grid place-content-center h-full w-full">
        <div className="loader"></div>
      </div>
    );
  return <Welcome />;
}
