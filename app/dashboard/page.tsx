import NavBar from "@/components/NavBar";
import FileUpload from "@/components/FileUpload";
import { getImagesByUserId } from "../lib/data";
import { ImageS3 } from "../lib/definitions";
import type { Metadata } from "next";
import ScrollTopButton from "@/components/ScrollTopButton";
import { auth } from "@/auth";
import { createUser } from "../lib/actions";
import { User } from "../lib/definitions";
import PhotoGrid from "@/components/PhotoGrid";
import Link from "next/link";
import { generateMetadataCustom } from "../utils/metadata";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = generateMetadataCustom("Dashboard");

export default async function Home() {
  const session = await auth();

  let userId: number | null = null;

  if (session && session.user) {
    try {
      userId = await createUser(session.user as User);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  if (!userId) {
    throw new Error("Failed to retrieve user ID");
  }

  const uploadedImages: ImageS3[] = await getImagesByUserId(userId);
  const emptyLibrary = uploadedImages.length === 0;

  return (
    <>
      <NavBar>
        <Link
          href="/dashboard/albums"
          className="gap-2 py-3 text-md px-4 rounded-3xl bg-background/60 hover:bg-white hover:text-black cursor-pointer"
        >
          Albums
        </Link>
      </NavBar> 
      <main className="mx-auto max-w-[1960px] mb-1">
        <div className="flex justify-center items-center">
          <h1 className="scroll-m-20 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-8">
            Welcome to SnapLink
          </h1>
        </div>
        <FileUpload userId={userId} />
        {emptyLibrary && (
          <div className="flex items-center justify-center mx-auto text-xs md:text-lg text-gray-500">
            Your Library is empty. Start uploading images.
          </div>
        )}
        {!emptyLibrary && <PhotoGrid images={uploadedImages} userId={userId} />}
        <ScrollTopButton />
      </main>
    </>
  );
}
