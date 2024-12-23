// components/PhotoGrid.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import ShareAlbumDialog from "@/components/ShareAlbumDialog";
import { ImageS3 } from "@/app/lib/definitions";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
export default function PhotoGrid({
  images,
  userId,
}: {
  images: ImageS3[];
  userId: number;
}) {
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPhotos([]);
  };

  const handleImageClick = (id: string) => {
    setSelectedPhotos((prev) =>
      prev.includes(id)
        ? prev.filter((photoId) => photoId !== id)
        : [...prev, id]
    );
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-4 mr-4">
        <Button
          className="text-xs sm:text-sm"
          onClick={toggleSelectionMode}
          variant="secondary"
        >
          {isSelectionMode ? "Cancel" : "Select Photos"}
        </Button>
        {isSelectionMode && selectedPhotos.length > 0 && (
          <ShareAlbumDialog
            userId={userId}
            selectedPhotos={selectedPhotos}
            onShare={() => {
              setSelectedPhotos([]);
              setIsSelectionMode(false);
            }}
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
        {images.map(({ id, src }) => (
          <div
            className="relative group cursor-pointer"
            key={id}
            onClick={() => isSelectionMode && handleImageClick(id)}
          >
            {isSelectionMode && selectedPhotos.includes(id) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-white font-bold">
                Selected <Check className="ml-2" />
              </div>
            )}
            {isSelectionMode ? (
              <Image
                width={573}
                height={322}
                alt="Image uploaded on SnapLink"
                src={src}
                className={`brightness-90 transition will-change-auto hover:brightness-110 object-cover aspect-[16/9] ${
                  isSelectionMode && selectedPhotos.includes(id)
                    ? "opacity-50 grayscale"
                    : ""
                }`}
              />
            ) : (
              <Link href={`/dashboard/photo/${id}`} className="cursor-zoom-in">
                <Image
                  width={573}
                  height={322}
                  alt="Image uploaded on SnapLink"
                  src={src}
                  className="brightness-90 transition will-change-auto hover:brightness-110 object-cover aspect-[16/9]"
                />
              </Link>
            )}
            {!isSelectionMode && <DeleteButton imageId={id} />}
          </div>
        ))}
      </div>
    </>
  );
}
