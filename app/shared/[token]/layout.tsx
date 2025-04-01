import type { Metadata } from "next";
import { getSharedAlbum } from "@/app/lib/data";
import { SharedAlbum } from "@/app/lib/definitions";

export const generateMetadata = async ({
  params,
}: {
  params: { token: string }; // Remove the Promise<> wrapper
}): Promise<Metadata> => {
  const token = params.token; // No need to await
  const album: SharedAlbum | null = await getSharedAlbum(token);

  if (!album) {
    return {
      title: "SnapLink | Shared Album",
      description: "SnapLink is a photo-sharing platform",
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
