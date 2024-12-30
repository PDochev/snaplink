// lib/metadata.ts
export function generateMetadataCustom(pageTitle?: string) {
  const baseTitle = "SnapLink";
  return {
    title: pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle,
    description: "SnapLink is a photo sharing platform",
    metadataBase: new URL("https://snaplink-two.vercel.app/"),
  };
}
