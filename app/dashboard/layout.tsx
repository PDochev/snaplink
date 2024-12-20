import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnapLink",
  description: "SnapLink is a photo sharing platform",
};

export default function DashboardLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {modal}
        <div id="modal-root" />
      </body>
    </html>
  );
}
