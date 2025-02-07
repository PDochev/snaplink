import Image from "next/image";
import { getImagesByUserId } from "@/app/lib/data";
import { ImageS3 } from "@/app/lib/definitions";
import { Metadata } from "next";
import BackButton from "@/components/BackButton";
import DownloadButton from "@/components/DownloadButton";
import { auth } from "@/auth";
import { getUserIdByEmail } from "@/app/lib/data";
import { User } from "@/app/lib/definitions";

export const generateMetadata = async (): Promise<Metadata> => {
  const session = await auth();

  return {
    title: "Photo | SnapLink",
    description: `Photo by ${session?.user?.name}`,
  };
};

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  const email: User["email"] = session?.user?.email ?? "";
  const userId = await getUserIdByEmail(email);

  const uploadedImages: ImageS3[] = await getImagesByUserId(Number(userId));
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
