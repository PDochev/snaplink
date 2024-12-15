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
import CloseButton from "./CloseButton";

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
      className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-2xl"
    >
      <dialog
        ref={dialogRef}
        className="fixed z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        onClose={onDismiss}
      >
        {children}
        <CloseButton onDismiss={onDismiss} />
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
