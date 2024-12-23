"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { deleteImage } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

export default function DeleteButton({ imageId }: { imageId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    try {
      setIsDeleting(true);
      setError(null);
      setOpen(false);
      await deleteImage(imageId);
      router.refresh();
    } catch (error) {
      console.error("Error deleting image:", error);
      setError("Failed to delete image. Please try again later.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 bg-black/70 text-white border-none rounded-full cursor-pointer border hover:border-white hover:border-2 hover:bg-red-400/90 transition-all duration-300 hover:scale-110"
        >
          <X />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-black w-80 rounded-sm sm:w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className={error ? "text-red-500" : ""}>
            {error ? (
              <>{error}</>
            ) : (
              <>
                This action cannot be undone. This will permanently delete the
                image and remove it from from our servers.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500/90 border hover:bg-red-700/80 "
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="animate-spin" /> Please Wait
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
