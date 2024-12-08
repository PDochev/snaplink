import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10">
      <ul className="w-full flex flex-row h-16 justify-start items-center  p-4 bg-white/60 ">
        <li className="flex gap-2">
          <Image
            src="/camera.svg"
            alt="SnapLink Logo"
            width={24}
            height={24}
            priority
          />
          <Link className=" font-medium" href="/">
            SnapLink
          </Link>
        </li>
      </ul>
    </nav>
  );
}
