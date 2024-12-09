import { neon } from "@neondatabase/serverless";

export async function getImages() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  const images = await sql<Array<{ id: number; name: string; image: string }>>`
    SELECT id, name, image FROM "photos" ORDER BY id DESC
  `;

  return images.map((img) => ({
    id: img.id.toString(),
    name: img.name,
    src: img.image,
  }));
}

// import { neon } from "@neondatabase/serverless";

// // Define an explicit interface for the database row
// interface ImageRow {
//   id: number;
//   name: string;
//   image: string;
// }

// export async function getImages() {
//   if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

//   const sql = neon(process.env.DATABASE_URL);

//   // Try explicit type casting
//   const images = (await sql`
//     SELECT id, name, image FROM "user" ORDER BY id DESC
//   `) as unknown as ImageRow[];

//   return images.map((img) => ({
//     id: img.id.toString(),
//     name: img.name,
//     src: img.image,
//   }));
// }
