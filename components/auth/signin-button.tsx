import { signIn, auth } from "@/auth";

export default async function SignIn() {
  const session = await auth();
  console.log(session);

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
