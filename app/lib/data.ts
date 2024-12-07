import { neon } from "@neondatabase/serverless";

export async function getImages() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  const images = await sql<Array<{ name: string; image: string }>>`
    SELECT name, image FROM "user"
  `;

  return images.map((img, index) => ({
    id: index.toString(),
    name: img.name,
    src: img.image,
  }));
}
