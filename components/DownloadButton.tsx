"use client";

import { Download } from "lucide-react";
import downloadPhoto from "@/app/utils/downloadPhoto";

export default function DownloadButton({ url }: { url: string }) {
  return (
    <button
      onClick={() => downloadPhoto(url)}
      className="absolute top-2 right-2 p-2 bg-white/50 border-none text-black  rounded-full cursor-pointer  hover:bg-white/75"
    >
      <Download />
    </button>
  );
}
