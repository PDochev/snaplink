"use client";

import {
  type ElementRef,
  useEffect,
  useRef,
  useCallback,
  MouseEventHandler,
} from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === dialogRef.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss]
  );

  return createPortal(
    <div
      ref={overlay}
      onClick={onClick}
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 "
    >
      <dialog
        ref={dialogRef}
        className="fixed inset-0 z-30 backdrop-blur-2xl w-4/5 max-w-lg sm:max-w-2xl border-none rounded-md "
        onClose={onDismiss}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute top-2 left-2 p-2 bg-white/50 border-none rounded-full cursor-pointer   hover:bg-white/75"
        >
          <X />
        </button>
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
