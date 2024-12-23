"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { User } from "./definitions";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function uploadImage(objectUrl: string, userId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "photos" (
        id SERIAL PRIMARY KEY,
        name TEXT,
        image TEXT,
        user_id INT REFERENCES "users"(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Fetch the username from the users table
    const userResult = await sql`
      SELECT name FROM "users" WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      throw new Error(`No user found with ID: ${userId}`);
    }

    // Extract the username from the result
    // userResult[0] returns an array of objects, so we need to access the first object
    // and then access the name property
    const userName = userResult[0].name;

    // Insert the image with the associated user ID , username and image URL
    await sql`INSERT INTO "photos" (name, image, user_id) VALUES (${userName}, ${objectUrl}, ${userId})`;

    // Revalidate the home path
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteImage(imageId: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  if (!process.env.AWS_S3_BUCKET_NAME)
    throw new Error("AWS_S3_BUCKET_NAME is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    // We are first fetching the S3 image URL from the database, using the imageId
    const image = await sql`
      SELECT image FROM "photos" WHERE id = ${imageId}
    `;

    if (image.length === 0) {
      throw new Error("Image not found");
    }

    // Extracts the image URL from the result
    // image[0] returns and array of objects, so we need to access the first object
    // and then access the image property
    const imageUrl = image[0].image;

    // Check if this image URL is used by other photos
    // We are counting the number of photos that have the same image URL
    // Counts how many photo entries in the database use exactly the same image URL
    // If count > 1, it means other users have the same image
    const sharedImages = await sql`
      SELECT COUNT(*) as count 
      FROM "photos" 
      WHERE image = ${imageUrl}
    `;

    // Delete the specific photo entry from the database
    // This only removes the database reference, not the actual S3 file
    // This happens regardless of whether the image is shared or not
    await sql`DELETE FROM "photos" WHERE id = ${imageId}`;

    // Only delete from S3 if this was the last reference to the image
    // If count is 1 or less, it means no other users are using this image
    // We can then delete the image from S3
    if (sharedImages[0].count <= 1) {
      // Initialize S3 client
      const s3Client = new S3Client({
        region: "eu-west-2",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });

      // We then extract the key from the S3 URL
      const s3Url = new URL(imageUrl);
      // new URL returns an object with the URL properties (protocol,hostname,pathname,etc)
      // We are interested in the pathname property which contains the key
      const key = s3Url.pathname.slice(1); // Remove leading slash
      // We remove the leading slash from the pathname
      // s3Url.pathname gives use and img key like /img.jpg
      // s3Url.pathname.slice(1) removes the leading slash and gives us img.jpg

      // Delete from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(deleteCommand);
    }

    // Revalidate the page
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export async function createUser(user: User): Promise<number> {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        image TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Check if the user already exists
    // We are using the email to check if the user already exists
    const existingUser = await sql`
      SELECT id FROM "users" 
      WHERE LOWER(email) = LOWER(${user.email})
    `;

    // If the user already exists, return the user ID
    // We are returning the user ID so that we can use it to associate the image with the user
    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0].id);
      return existingUser[0].id; // Return existing user ID
    }

    // Insert the user if they don't exist
    // We are returning the user ID so that we can use it to associate the image with the user
    const newUser = await sql`
      INSERT INTO "users" (name, email, image) 
      VALUES (${user.name}, ${user.email}, ${user.image})
      RETURNING id
    `;

    console.log("User created:", newUser[0].id);
    // newUser[0] returns an array of objects, so we need to access the first object
    // and then access the id property
    // We are returning the user ID so that we can use it to associate the image with the user
    return newUser[0].id; // Return new user ID
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

export async function createSharedAlbum(
  userId: number,
  title: string,
  description?: string
) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create shared_albums table if it doesn't exist
    // We are creating a shared_albums table to store the shared albums
    // share_token is unique and used for public access to the album
    // share_token is generated using crypto.randomUUID()
    await sql`
      CREATE TABLE IF NOT EXISTS "shared_albums" (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES "users"(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        share_token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create junction table for album photos
    // Many-to-many relationship between shared_albums and photos
    // We are creating a junction table to associate photos with the shared album
    // album_id and photo_id are foreign keys that reference shared_albums and photos tables
    // We are using a composite primary key to ensure that a photo can only be associated with an album once
    // This is done by using the PRIMARY KEY (album_id, photo_id) constraint
    // We are using ON DELETE CASCADE to delete the associated album_photos entries when an album or photo is deleted
    await sql`
      CREATE TABLE IF NOT EXISTS "album_photos" (
        album_id INT REFERENCES "shared_albums"(id) ON DELETE CASCADE,
        photo_id INT REFERENCES "photos"(id) ON DELETE CASCADE,
        PRIMARY KEY (album_id, photo_id)
      )
    `;

    // Generate a unique share token
    const shareToken = crypto.randomUUID();

    // Create the album
    const album = await sql`
      INSERT INTO "shared_albums" (user_id, title, description, share_token)
      VALUES (${userId}, ${title}, ${description}, ${shareToken})
      RETURNING id
    `;

    return { albumId: album[0].id, shareToken };
  } catch (error) {
    console.error("Error creating shared album:", error);
    throw error;
  }
}

export async function addPhotosToAlbum(albumId: number, photoIds: number[]) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Insert all photo associations in a single query
    // We are inserting all the photo associations in a single query
    // We are using unnest() to convert the photoIds array into a set of rows
    // Ensures that the array is treated as an array of integers (int[]). This is done by casting the array to int[]
    // This is often necessary for compatibility with PostgreSQL’s unnest function.
    await sql`
      INSERT INTO "album_photos" (album_id, photo_id)
      SELECT ${albumId}, unnest(${photoIds}::int[])
    `;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error adding photos to album:", error);
    throw error;
  }
}

export async function deleteSharedAlbum(albumId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Delete the album (this will cascade delete album_photos entries)
    await sql`
      DELETE FROM "shared_albums"
      WHERE id = ${albumId}
    `;

    revalidatePath("/dashboard/albums");
    return { success: true };
  } catch (error) {
    console.error("Error deleting album:", error);
    throw error;
  }
}
