"use client";

import { ExternalLink } from "lucide-react";

export default function ExternalLinkButton({ link }: { link: string }) {
  return (
    <button
      onClick={() => window.open(link, "_blank")}
      className="absolute top-2 right-16 p-2 bg-white/50 border-none text-black  rounded-full cursor-pointer  hover:bg-white/75"
    >
      <ExternalLink />
    </button>
  );
}
