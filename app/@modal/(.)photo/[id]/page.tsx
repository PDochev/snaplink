import PhotoModalClient from "@/components/PhotoModalClient";
import { getImages } from "@/app/lib/data";
import { ImageS3 } from "@/app/lib/definitions";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uploadedImages: ImageS3[] = await getImages();
  const id = (await params).id;
  const initialIndex = uploadedImages.findIndex((p) => p.id === id);

  if (initialIndex === -1) {
    throw new Error("Image not found");
  }

  return (
    <PhotoModalClient images={uploadedImages} initialIndex={initialIndex} />
  );
}
