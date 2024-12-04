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
      className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center z-[1000] bg-black/75"
    >
      <dialog
        ref={dialogRef}
        className="w-1/2 border-none rounded-md bg-white relative flex items-center justify-center"
        onClose={onDismiss}
      >
        {children}
        <button onClick={onDismiss} className="close-button" />
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  );
}
