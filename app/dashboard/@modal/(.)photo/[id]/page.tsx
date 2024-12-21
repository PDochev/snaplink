import PhotoModalClient from "@/components/PhotoModalClient";
import { getImagesByUserId } from "@/app/lib/data";
import { ImageS3 } from "@/app/lib/definitions";
import { auth } from "@/auth";
import { getUserIdByEmail } from "@/app/lib/data";
import { User } from "@/app/lib/definitions";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const email: User["email"] = session?.user?.email ?? "";

  const userId = await getUserIdByEmail(email);

  const uploadedImages: ImageS3[] = await getImagesByUserId(Number(userId));
  const id = (await params).id;
  const initialIndex = uploadedImages.findIndex((p) => p.id === id);

  if (initialIndex === -1) {
    throw new Error("Image not found");
  }

  return (
    <PhotoModalClient images={uploadedImages} initialIndex={initialIndex} />
  );
}
