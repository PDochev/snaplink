"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

export default function ExternalLinkButton({ link }: { link: string }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => window.open(link, "_blank")}
      className="absolute top-2 right-16 bg-white/50 text-black hover:text-black border-none rounded-full cursor-pointer hover:bg-white/75"
    >
      <ExternalLink />
    </Button>
  );
}
