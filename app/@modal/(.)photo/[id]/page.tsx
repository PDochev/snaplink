import Image from "next/image";
import wondersImages, { WonderImage } from "../../../wonders";
import Modal from "@/components/modal";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const photo: WonderImage = wondersImages.find((p) => p.id === id)!;

  return (
    <Modal>
      <Image
        alt={photo.name}
        src={photo.src}
        className="transform brightness-110 transition will-change-auto  object-cover aspect-square"
      />
    </Modal>
  );
}
