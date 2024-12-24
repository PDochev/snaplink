import { getSharedAlbum } from "@/app/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SharedAlbum, ImageS3 } from "@/app/lib/definitions";
import Link from "next/link";
import ScrollTopButton from "@/components/ScrollTopButton";

export default async function SharedAlbumPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const token = (await params).token;
  const album: SharedAlbum | null = await getSharedAlbum(token);

  if (!album) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1960px] p-4 mt-8">
      <div className="mb-8 ">
        <h1 className="text-3xl font-bold mb-2">{album.title}</h1>
        {album.description && <p className="text-white">{album.description}</p>}
        <p className="text-sm text-gray-500 mt-2">
          Shared by {album.user_name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {album.photos.map((photo: ImageS3) => (
          <div key={photo.id} className="relative">
            <Link
              className=" cursor-zoom-in "
              href={`/shared/${token}/photo/${photo.id}`}
            >
              <Image
                width={573}
                height={322}
                alt={`Photo by ${album.user_name}`}
                src={photo.src}
                className="brightness-90 transition will-change-auto hover:brightness-110 object-cover aspect-[16/9] rounded-lg"
              />
            </Link>
          </div>
        ))}
        <ScrollTopButton />
      </div>
    </main>
  );
}
