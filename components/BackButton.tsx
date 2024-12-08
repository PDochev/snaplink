"use client";

import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="absolute top-2 left-2 p-2  bg-white/50 border-none text-black  rounded-full cursor-pointer  hover:bg-white/75"
    >
      <Undo2 />
    </button>
  );
}
