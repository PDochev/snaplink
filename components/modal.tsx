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
      className="absolute top-0 left-0 right-0 bottom-0 flex justify-center  items-center z-[1000] bg-black/75 "
    >
      <dialog
        ref={dialogRef}
        className="w-4/5 max-w-lg sm:max-w-2xl border-none rounded-md bg-white relative flex items-center justify-center "
        onClose={onDismiss}
      >
        {children}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 w-12 h-12 bg-transparent border-none rounded-2xl cursor-pointer flex items-center justify-center font-medium text-2xl after:content-['x'] after:text-black hover:bg-slate-100"
        />
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
