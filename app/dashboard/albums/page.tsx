import { getUserAlbums } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { getUserIdByEmail } from "@/app/lib/data";
import CopyLinkButton from "./CopyLinkButton";
import DeleteAlbumButton from "./DeleteAlbumButton";

export default async function AlbumsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const email = session?.user?.email ?? "";
  const userId = await getUserIdByEmail(email);
  if (!userId) throw new Error("User not found");

  const albums = await getUserAlbums(userId);

  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-[1960px] p-4">
        <h1 className="text-3xl font-bold mb-8">My Shared Albums</h1>

        {albums.length === 0 ? (
          <p className="text-gray-500">
            You have not created any shared albums yet. Go to your photos and
            select some to share!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {albums.map((album) => (
              <div
                key={album.id}
                className="overflow-hidden bg-primary shadow-sm"
              >
                <div className="aspect-[16/9] relative">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-400">No photo</p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{album.title}</h2>
                  {album.description && (
                    <p className="text-gray-600 mb-2">{album.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-4">
                    {album.photoCount} photos · Created on{" "}
                    {new Date(album.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2">
                      <Link
                        href={`/shared/${album.shareToken}`}
                        className="text-blue-500/90  hover:text-blue-400 text-sm "
                        target="_blank"
                      >
                        View Album
                      </Link>
                      <CopyLinkButton shareToken={album.shareToken} />
                    </div>
                    <DeleteAlbumButton
                      albumId={album.id}
                      albumTitle={album.title}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
