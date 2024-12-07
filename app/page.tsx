import Link from "next/link";
// import wonders from "./wonders";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import FileUpload from "@/components/FileUpload";
import { getImages } from "./lib/data";

export default async function Home() {
  const uploadedImages = await getImages();
  return (
    <>
      <NavBar />
      <main className="mx-auto max-w-[1960px] p-4">
        <div>
          <h1 className="text-center text-3xl font-bold my-4">
            Welcome to SnapLink
          </h1>
        </div>
        <FileUpload />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {uploadedImages.map(({ id, src }) => (
            <Link
              className="after:content group cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
              key={id}
              href={`/photo/${id}`}
            >
              <Image
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                 (max-width: 1280px) 50vw,
                 (max-width: 1536px) 33vw,
                 25vw"
                alt="Image uploaded on SnapLink"
                src={src}
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110 object-cover aspect-square"
                // style={{ transform: "translate3d(0, 0, 0)" }}
              />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
