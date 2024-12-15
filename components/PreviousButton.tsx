"use client";

import { ArrowLeft } from "lucide-react";

export default function PreviousButton({
  onPrevious,
}: {
  onPrevious: () => void;
}) {
  return (
    <button
      onClick={onPrevious}
      className="absolute bottom-240 left-2 p-2 bg-white/50 border-none text-black rounded-full cursor-pointer hover:bg-white/75"
    >
      <ArrowLeft />
    </button>
  );
}
