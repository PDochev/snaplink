import { signIn, auth } from "@/auth";
import { createUser } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function SignIn() {
  const session = await auth();
  console.log(session);

  if (session) {
    // Save the user to the database
    const { user } = session;
    if (user) {
      try {
        await createUser(user as User);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }
  }

  return (
    <div className="flex items-center  w-full h-svh">
      <section className="lg:w-1/2 flex flex-col items-center justify-center mx-auto gap-4">
        <Image src="/camera.svg" alt="SnapLink Logo" width={100} height={100} />
        <h1 className="scroll-m-20 border-b pb-2 text-4xl font-extrabold tracking-tight lg:text-5xl">
          SnapLink
        </h1>
        <h2 className="font-medium">Login to use SnapLink</h2>
        <form
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/auth-callback",
            });
          }}
        >
          <Button type="submit">
            <Image src="/google.svg" alt="Google Logo" width={20} height={20} />
            Continue with Google
          </Button>
        </form>
      </section>
      <section className="hidden w-1/2 lg:flex">
        <div className="w-full h-svh group overflow-hidden flex">
          <Image
            width={1920}
            height={100}
            src="/login_pic1.jpg"
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
            alt="Login Image"
          />
        </div>
      </section>
    </div>
  );
}
