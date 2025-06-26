import type { Metadata } from "next";
import { getSharedAlbum } from "@/app/lib/data";
import { SharedAlbum } from "@/app/lib/definitions";

interface LayoutProps {
  params: Promise<{ token: string }>;
  children: React.ReactNode;
  modal: React.ReactNode;
}

export const generateMetadata = async ({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> => {
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
}: Readonly<LayoutProps>) {
  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
