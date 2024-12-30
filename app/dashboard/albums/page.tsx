import { getUserAlbums } from "@/app/lib/data";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { getUserIdByEmail } from "@/app/lib/data";
import CopyLinkButton from "./CopyLinkButton";
import DeleteAlbumButton from "./DeleteAlbumButton";
import SearchAlbum from "@/components/SearchAlbum";
import { getFilteredAlbums } from "@/app/lib/data";
import { generateMetadataCustom } from "@/app/utils/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generateMetadataCustom("Albums");

export default async function AlbumsPage(props: {
  searchParams?: Promise<{
    query?: string;
  }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const email = session?.user?.email ?? "";
  const userId = await getUserIdByEmail(email);
  if (!userId) throw new Error("User not found");

  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";

  // First get all user albums to check if the user has any
  const userAlbums = await getUserAlbums(userId);

  // Only perform search if there are albums and a search query
  const albums =
    userAlbums.length > 0 && query
      ? await getFilteredAlbums(query, userId)
      : userAlbums;

  return (
    <>
      <NavBar>
        <Link
          href="/dashboard"
          className="gap-2 py-3 text-md px-4 rounded-3xl bg-background/60 hover:bg-white hover:text-black cursor-pointer"
        >
          Dashboard
        </Link>
      </NavBar>
      <main className="mx-auto max-w-[1960px] p-2">
        <h1 className="scroll-m-20 text-3xl sm:text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl text-center mt-8 mb-12">
          My Shared Albums
        </h1>

        {/* Only show search if there are albums */}
        {userAlbums.length > 0 && (
          <SearchAlbum placeholder="Search albums by title" />
        )}

        {userAlbums.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-gray-500">
              You have not created any shared albums yet. Go to your photos and
              select some to share!
            </p>
          </div>
        ) : query && albums.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-gray-500">
              {`No albums found matching "${query}". Try a different search term.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 grid-auto-rows">
            {albums.map((album) => (
              <div
                key={album.id}
                className="overflow-hidden bg-zinc-700/20 shadow-sm" // h-fit
              >
                <div className="aspect-[16/9] relative ">
                  {album.coverImage ? (
                    <Image
                      src={album.coverImage}
                      alt={album.title}
                      fill
                      className="object-cover rounded-b-3xl"
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
                    <p className="text-white mb-2">{album.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mb-4">
                    {album.photoCount} photos · Created on{" "}
                    {new Date(album.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2">
                      <Link
                        href={`/shared/${album.shareToken}`}
                        className="text-blue-500/90 hover:text-blue-400 text-sm"
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
