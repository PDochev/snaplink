"use client";

import { X } from "lucide-react";
import { Button } from "./ui/button";

export default function CloseButton({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onDismiss}
      className="absolute top-2 left-2 bg-white/50 border-none rounded-full cursor-pointer hover:bg-white/75"
    >
      <X />
    </Button>
  );
}
