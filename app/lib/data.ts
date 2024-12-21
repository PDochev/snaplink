import { neon } from "@neondatabase/serverless";

export async function getImagesByUserId(userId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  const images = (await sql`
    SELECT id, name, image 
    FROM "photos" 
    WHERE user_id = ${userId} 
    ORDER BY id DESC
  `) as Array<{ id: number; name: string; image: string }>;

  return images.map((img) => ({
    id: img.id.toString(),
    name: img.name,
    src: img.image,
  }));
}

export async function getUserIdByEmail(email: string): Promise<number | null> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    const result = await sql`
      SELECT id FROM "users" WHERE LOWER(email) = LOWER(${email})
    `;

    if (result.length > 0) {
      return result[0].id;
    }

    return null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    throw error;
  }
}
