import { neon } from "@neondatabase/serverless";
import { SharedAlbum } from "./definitions";

export async function getImagesByUserId(
  userId: number
): Promise<Array<{ id: string; name: string; src: string }>> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  const images = (await sql`
    SELECT id, name, image 
    FROM "photos" 
    WHERE user_id = ${userId} 
    ORDER BY created_at DESC
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

export async function getSharedAlbum(
  shareToken: string
): Promise<SharedAlbum | null> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Get album details
    // In a query with multiple joined tables, columns with the same name might exist in different tables.
    // Using aliases ensures that we can differentiate between columns with the same name.
    const album = await sql`
      SELECT sa.*, u.name as user_name
      FROM "shared_albums" sa
      JOIN "users" u ON sa.user_id = u.id
      WHERE sa.share_token = ${shareToken}
    `;

    if (album.length === 0) {
      return null;
    }

    // Get all photos in the album
    const photos = await sql`
      SELECT p.*
      FROM "photos" p
      JOIN "album_photos" ap ON p.id = ap.photo_id
      WHERE ap.album_id = ${album[0].id}
      ORDER BY p.created_at DESC
    `;

    return {
      ...(album[0] as SharedAlbum),
      photos: photos.map((photo) => ({
        id: photo.id.toString(),
        name: photo.name,
        src: photo.image,
      })),
    };
  } catch (error) {
    console.error("Error fetching shared album:", error);
    throw error;
  }
}

export async function getUserAlbums(userId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    const albums = await sql`
      SELECT 
        sa.*,
        COUNT(ap.photo_id) as photo_count,
        MIN(p.image) as cover_image
      FROM shared_albums sa
      LEFT JOIN album_photos ap ON sa.id = ap.album_id
      LEFT JOIN photos p ON ap.photo_id = p.id
      WHERE sa.user_id = ${userId}
      GROUP BY sa.id
      ORDER BY sa.created_at DESC
    `;

    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      shareToken: album.share_token,
      photoCount: parseInt(album.photo_count),
      coverImage: album.cover_image,
      createdAt: album.created_at,
    }));
  } catch (error) {
    console.error("Error fetching user albums:", error);
    throw error;
  }
}

export async function getFilteredAlbums(query: string, userId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Add wildcards to the query for partial matching
    const searchPattern = `%${query}%`;

    const albums = await sql`
      SELECT 
        sa.*,
        COUNT(ap.photo_id) as photo_count,
        MIN(p.image) as cover_image
      FROM shared_albums sa
      LEFT JOIN album_photos ap ON sa.id = ap.album_id
      LEFT JOIN photos p ON ap.photo_id = p.id
      WHERE sa.title ILIKE ${searchPattern}
      AND sa.user_id = ${userId}
      GROUP BY sa.id
      ORDER BY sa.created_at DESC
    `;

    return albums.map((album) => ({
      id: album.id,
      title: album.title,
      description: album.description,
      shareToken: album.share_token,
      photoCount: parseInt(album.photo_count),
      coverImage: album.cover_image,
      createdAt: album.created_at,
    }));
  } catch (error) {
    console.error("Error fetching filtered albums:", error);
    throw error;
  }
}
