import { neon } from "@neondatabase/serverless";

export async function getImages() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  const images = await sql<Array<{ id: number; name: string; image: string }>>`
    SELECT id, name, image FROM "user"
  `;

  return images.map((img) => ({
    id: img.id.toString(),
    name: img.name,
    src: img.image,
  }));
}
