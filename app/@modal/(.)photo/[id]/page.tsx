import Image from "next/image";
import Modal from "@/components/modal";
import { getImages } from "@/app/lib/data";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uploadedImages = await getImages();
  const id = (await params).id;
  const photo = uploadedImages.find((p) => p.id === id)!;

  return (
    <Modal>
      <Image
        width={720}
        height={480}
        alt="Image uploaded on SnapLink"
        sizes="(max-width: 640px) 100vw,
                 (max-width: 1280px) 50vw,
                 (max-width: 1536px) 33vw,
                 25vw"
        src={photo.src}
        className="transform brightness-110 transition will-change-auto object-cover aspect-square"
      />
    </Modal>
  );
}
