import Link from "next/link";
import Image from "next/image";
import UserAvatar from "./auth/UserAvatar";

export default async function NavBar({
  children,
}: {
  children: React.ReactNode;
}) {
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
          {children}
          <UserAvatar />
        </li>
      </ul>
    </nav>
  );
}
