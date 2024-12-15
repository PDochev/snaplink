"use client";

import { ArrowRight } from "lucide-react";

export default function NextButton({ onNext }: { onNext: () => void }) {
  return (
    <button
      onClick={onNext}
      className="absolute bottom-240 right-2 p-2 bg-white/50 border-none text-black rounded-full cursor-pointer hover:bg-white/75"
    >
      <ArrowRight />
    </button>
  );
}
