"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteSharedAlbum } from "@/app/lib/actions";
import { Button } from "@/components/ui/button";

export default function DeleteAlbumButton({
  albumId,
  albumTitle,
}: {
  albumId: number;
  albumTitle: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSharedAlbum(albumId);
    } catch (error) {
      console.error("Error deleting album:", error);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-red-600 hover:text-red-600 border-none p-2 rounded-full hover:bg-red-300 transition-colors"
        aria-label="Delete album"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="bg-background w-80 rounded-sm sm:w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Album</AlertDialogTitle>
            <AlertDialogDescription>
              {`Are you sure you want to delete ${albumTitle}? This action cannot
              be undone. The shared link will no longer work, but your original
              photos will remain in your library.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500/90 hover:bg-red-700/80 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete Album"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
