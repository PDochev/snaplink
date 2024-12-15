"use client";

import { X } from "lucide-react";

export default function CloseButton({ onDismiss }: { onDismiss: () => void }) {
  return (
    <button
      onClick={onDismiss}
      className="absolute top-2 left-2 p-0.5 sm:p-2 bg-white/50 border-none rounded-full cursor-pointer hover:bg-white/75"
    >
      <X />
    </button>
  );
}
