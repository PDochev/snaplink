import Link from "next/link";

export default function NavBar() {
  return (
    <nav>
      <ul className="w-full flex flex-row h-16 justify-start items-center border-b p-4 ">
        <li>
          <Link href="/">SnapLink</Link>
        </li>
      </ul>
    </nav>
  );
}
