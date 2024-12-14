import Image from "next/image";
import Modal from "@/components/modal";
import { getImages } from "@/app/lib/data";
import { ImageS3 } from "@/app/lib/definitions";
import ExternalLinkButton from "@/components/ExternalLinkButton";
import DownloadButton from "@/components/DownloadButton";

export default async function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uploadedImages: ImageS3[] = await getImages();
  const id = (await params).id;
  const photo = uploadedImages.find((p) => p.id === id)!;

  return (
    <Modal>
      <Image
        width={720}
        height={480}
        alt="Image uploaded on SnapLink"
        src={photo.src}
        className="w-full h-full transform brightness-110 transition will-change-auto object-cover "
      />
      <ExternalLinkButton link={photo.src} />
      <DownloadButton url={photo.src} />
    </Modal>
  );
}
