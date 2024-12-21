"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";

export default function PreviousButton({
  onPrevious,
}: {
  onPrevious: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onPrevious}
      className="absolute bottom-240 left-2 bg-white/50 border-none rounded-full cursor-pointer hover:bg-white/75"
    >
      <ArrowLeft />
    </Button>
  );
}
