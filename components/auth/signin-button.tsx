import { signIn, auth } from "@/auth";
import { createUser } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
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
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/dashboard",
        });
      }}
    >
      <button type="submit">Sign in with Google</button>
    </form>
  );
}
