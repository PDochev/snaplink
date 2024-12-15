import Image from "next/image";
import { getImages } from "@/app/lib/data";
import { ImageS3 } from "@/app/lib/definitions";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";
import DownloadButton from "@/components/DownloadButton";

type Props = {
  params: { id: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const uploadedImages: ImageS3[] = await getImages();
  const id = (await params).id;
  const photo = uploadedImages.find((p) => p.id === id)!;

  return {
    title: "Photo | SnapLink",
    description: `Photo by ${photo.name}`,
  };
};

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const uploadedImages: ImageS3[] = await getImages();
  const id = (await params).id;
  const photo = uploadedImages.find((p) => p.id === id)!;

  return (
    <div className="mx-auto max-w-[1960px]  h-svh flex items-center justify-center">
      <div className="relative">
        <Image
          width={1280}
          height={480}
          alt="Image uploaded on SnapLink"
          src={photo.src}
          className=" aspect-[3/2] brightness-110 transition will-change-auto object-cover "
        />
        <BackButton />
        <DownloadButton url={photo.src} />
      </div>
    </div>
  );
}
