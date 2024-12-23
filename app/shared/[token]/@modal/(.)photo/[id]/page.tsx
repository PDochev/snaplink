import PhotoModalClient from "@/components/PhotoModalClient";
import { getSharedAlbum } from "@/app/lib/data";

import { getUserIdByEmail } from "@/app/lib/data";
import { SharedAlbum } from "@/app/lib/definitions";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ share_token: string; id: string }>;
}) {
  const id = (await params).id;
  const token = (await params).share_token;
  const album: SharedAlbum | null = await getSharedAlbum(token);

  if (!album) {
    throw new Error("Album not found");
  }
  const initialIndex = album.photos.findIndex((p) => p.id === id);

  if (initialIndex === -1) {
    throw new Error("Image not found");
  }

  return <PhotoModalClient images={album.photos} initialIndex={initialIndex} />;
}
