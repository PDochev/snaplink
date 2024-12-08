"use client";

import Image from "next/image";

export default function ScrollTopButton() {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-4 right-4 z-50 p-4 bg-white/50 rounded-full shadow-md hover:bg-white/75"
    >
      <Image
        src="/arrow-up.svg"
        alt="Up Arrow"
        width={24}
        height={24}
        priority
      />
    </button>
  );
}
