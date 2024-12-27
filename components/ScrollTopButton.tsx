"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    // Show button when user scrolls down 200px
    const scrolled = window.scrollY;
    setIsVisible(scrolled > 200);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`fixed bottom-4 right-4 z-50 p-4  bg-white/50 rounded-full shadow-md hover:bg-white/75 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
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
