import { auth } from "../../auth";
import Image from "next/image";
import { SignOut } from "./signout-button";

export default async function UserAvatar() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div>
      <Image
        width={48}
        height={48}
        src={user?.image ?? "/default-avatar.png"}
        alt="User Avatar"
      />
      <SignOut />
    </div>
  );
}
