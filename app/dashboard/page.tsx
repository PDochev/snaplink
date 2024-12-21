import Link from "next/link";
// import wonders from "./wonders";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import FileUpload from "@/components/FileUpload";
import { getImages } from "../lib/data";
import { ImageS3 } from "../lib/definitions";
import { Metadata } from "next";
import ScrollTopButton from "@/components/ScrollTopButton";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { createUser } from "../lib/actions";
import { User } from "../lib/definitions";

// export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SnapLink",

  // url: "https://snaplink.vercel.app",
  // type: "website",
};

export default async function Home() {
  const session = await auth();
  if (!session) redirect("/login");

  if (session && session.user) {
    try {
      await createUser(session.user as User);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  }

  console.log("session", session);

  // const user = session.user;
  const uploadedImages: ImageS3[] = await getImages();
  const emptyLibrary = uploadedImages.length === 0;
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-[1960px] mb-1">
        <div className="flex justify-center items-center">
          <h1 className="scroll-m-20 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-8">
            Welcome to SnapLink
          </h1>
        </div>
        <FileUpload />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
          {emptyLibrary ? (
            <div className="flex items-center justify-center">
              Your Library is empty. Start uploading images.
            </div>
          ) : (
            uploadedImages.map(({ id, src }) => (
              <Link
                className="cursor-zoom-in"
                key={id}
                href={`/dashboard/photo/${id}`}
              >
                <Image
                  width={573}
                  height={322}
                  alt="Image uploaded on SnapLink"
                  src={src}
                  className="brightness-90 transition will-change-auto hover:brightness-110 object-cover aspect-[16/9]"
                />
              </Link>
            ))
          )}
        </div>
        <ScrollTopButton />
      </main>
    </>
  );
}
