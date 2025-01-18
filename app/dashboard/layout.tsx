import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
