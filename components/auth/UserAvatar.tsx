import { auth } from "../../auth";
import Image from "next/image";
import { SignOut } from "./signout-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function UserAvatar() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className="cursor-pointer">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <Image
              width={48}
              height={48}
              src={user?.image ?? "/camera.svg"}
              alt="Your profile picture"
            />
            <AvatarFallback>{user?.name?.at(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mx-4 p-2  text-foreground">
          <div className="flex items-center gap-2 ">
            <Avatar className="flex">
              <Image
                width={48}
                height={48}
                src={user?.image ?? "/camera.svg"}
                alt="Your profile picture"
              />
            </Avatar>
            <div>
              <small className="text-sm font-medium leading-none">
                {user.name}
              </small>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <div>
            <SignOut />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
