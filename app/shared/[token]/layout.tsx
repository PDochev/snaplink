import type { Metadata } from "next";
import { getSharedAlbum } from "@/app/lib/data";
import { SharedAlbum } from "@/app/lib/definitions";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ token: string }>;
  modal?: React.ReactNode; // Add this optional property
}): Promise<Metadata> => {
  const token = (await params).token;
  const album: SharedAlbum | null = await getSharedAlbum(token);
  if (!album) {
    return {
      title: "SnapLink | Shared Album",
      description: "SnapLink is a photo sharing platform",
    };
  }
  return {
    title: `SnapLink | ${album.title}`,
    description: `Photo by ${album.user_name}`,
  };
};

export default function SharedAlbumsLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
