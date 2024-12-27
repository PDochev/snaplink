"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function NextButton({ onNext }: { onNext: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onNext}
      className="absolute bottom-240 right-2 bg-white/50 text-black hover:text-black border-none rounded-full cursor-pointer hover:bg-white/75"
    >
      <ArrowRight />
    </Button>
  );
}
