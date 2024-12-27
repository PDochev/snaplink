import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./auth/UserAvatar";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10">
      <ul className="w-full flex flex-row h-16 justify-between items-center p-4">
        <li className="flex items-center justify-center gap-2 py-3 px-4 rounded-3xl bg-background/60">
          <Image
            src="/camera.svg"
            alt="SnapLink Logo"
            width={24}
            height={24}
            priority
          />
          <Link className="font-medium" href="/dashboard">
            SnapLink
          </Link>
        </li>

        <li className="flex items-center gap-4">
          <div className="gap-2 py-3 px-4 rounded-3xl bg-black/60">
            <Link
              href="/dashboard/albums"
              className="text-md font-medium transition-colors text-foreground hover:text-white/70"
            >
              Albums
            </Link>
          </div>
          <UserAvatar />
        </li>
      </ul>
    </nav>
  );
}
