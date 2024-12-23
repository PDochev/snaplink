// components/ShareAlbumDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createSharedAlbum, addPhotosToAlbum } from "@/app/lib/actions";

export default function ShareAlbumDialog({
  userId,
  selectedPhotos,
  onShare,
}: {
  userId: number;
  selectedPhotos: string[];
  onShare?: (shareUrl: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleShare = async () => {
    if (!title || selectedPhotos.length === 0) return;

    setIsCreating(true);
    try {
      // Create the album
      const { albumId, shareToken } = await createSharedAlbum(
        userId,
        title,
        description
      );

      // Add selected photos to the album
      await addPhotosToAlbum(
        albumId,
        selectedPhotos.map((id) => parseInt(id))
      );

      // Generate share URL
      const url = `${window.location.origin}/shared/${shareToken}`;
      setShareUrl(url);
      onShare?.(url);
    } catch (error) {
      console.error("Error sharing album:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share Selected Photos</Button>
      </DialogTrigger>
      <DialogContent className="bg-primary text-secondary ">
        <DialogHeader>
          <DialogTitle>Create Shared Album</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Album Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter album title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter album description"
            />
          </div>
          {!shareUrl && (
            <Button
              variant="secondary"
              onClick={handleShare}
              disabled={isCreating || !title || selectedPhotos.length === 0}
            >
              {isCreating ? "Creating..." : "Create and Share"}
            </Button>
          )}
          {shareUrl && (
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}