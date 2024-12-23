import Image from "next/image";
import { SharedAlbum } from "@/app/lib/definitions";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";
import DownloadButton from "@/components/DownloadButton";
import { getSharedAlbum } from "@/app/lib/data";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Photo | SnapLink",
    description: `Photo by SnapLink  `,
  };
};

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const id = (await params).id;
  const token = (await params).token;
  const album: SharedAlbum | null = await getSharedAlbum(token);

  if (!album) {
    throw new Error("Album not found");
  }

  const photo = album.photos.find((p) => p.id === id)!;

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
