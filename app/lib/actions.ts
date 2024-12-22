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

    const userName = userResult[0].name;

    // Insert the image with the associated user ID and username
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
    // We are first fetching the S3 image URL from the database
    const image = await sql`
      SELECT image FROM "photos" WHERE id = ${imageId}
    `;

    if (image.length === 0) {
      throw new Error("Image not found");
    }

    // We then extract the key from the S3 URL

    // image[0] returns and array of objects, so we need to access the first object
    // and then access the image property
    const s3Url = new URL(image[0].image);
    // new URL returns an object with the URL properties (protocol,hostname,pathname,etc)
    // We are interested in the pathname property which contains the key
    // We remove the leading slash from the pathname
    // s3Url.pathname gives use and img key like /img.jpg
    // s3Url.pathname.slice(1) removes the leading slash and gives us img.jpg

    const key = s3Url.pathname.slice(1); // Remove leading slash

    // Initialize S3 client
    const s3Client = new S3Client({
      region: "eu-west-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Delete from S3
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    // Delete from database
    await sql`DELETE FROM "photos" WHERE id = ${imageId}`;

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
    const existingUser = await sql`
      SELECT id FROM "users" 
      WHERE LOWER(email) = LOWER(${user.email})
    `;

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0].id);
      return existingUser[0].id; // Return existing user ID
    }

    // Insert the user if they don't exist
    const newUser = await sql`
      INSERT INTO "users" (name, email, image) 
      VALUES (${user.name}, ${user.email}, ${user.image})
      RETURNING id
    `;

    console.log("User created:", newUser[0].id);
    return newUser[0].id; // Return new user ID
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
