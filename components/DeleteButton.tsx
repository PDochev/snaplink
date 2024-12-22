"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteImage } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export default function DeleteButton({ imageId }: { imageId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (confirm("Are you sure you want to delete this image?")) {
      try {
        setIsDeleting(true);
        await deleteImage(imageId);
        router.refresh();
      } catch (error) {
        console.error("Failed to delete image:", error);
        alert("Failed to delete image. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="absolute top-2 right-2 bg-black/70 text-white border-none rounded-full cursor-pointer border hover:border-white hover:border-2 hover:bg-red-400/90 transition-all duration-300 hover:scale-110"
    >
      {isDeleting ? <Loader2 className="animate-spin" /> : <X />}
    </Button>
  );
}
