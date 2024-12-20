import { signOut } from "@/auth";
import { Button } from "../ui/button";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        className="flex items-center justify-center w-full"
        variant="ghost"
        type="submit"
      >
        Sign Out
      </Button>
    </form>
  );
}
