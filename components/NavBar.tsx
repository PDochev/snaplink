import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./auth/UserAvatar";

export default async function NavBar() {
  return (
    <nav className="sticky top-0 z-10">
      <ul className="w-full flex flex-row h-16 justify-between items-center p-4">
        <Link
          href="/dashboard"
          className="flex items-center font-medium justify-center gap-2 py-3 px-4 rounded-3xl bg-background/60 hover:bg-white hover:text-black"
        >
          <Image
            src="/camera.svg"
            alt="SnapLink Logo"
            width={24}
            height={24}
            priority
          />
          SnapLink
        </Link>
        <li className="flex items-center gap-4">
          <Link
            href="/dashboard/albums"
            className="gap-2 py-3 text-md font-medium px-4 rounded-3xl bg-background/60 hover:bg-white hover:text-black cursor-pointer"
          >
            Albums
          </Link>
          <UserAvatar />
        </li>
      </ul>
    </nav>
  );
}
