"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";

export async function uploadImage(objectUrl: string) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create the user table with an auto-incrementing primary key
    await sql(`
      CREATE TABLE IF NOT EXISTS "photos" (
        id SERIAL PRIMARY KEY,
        name TEXT,
        image TEXT
      )
    `);

    // Mock call to get the user
    const user = "snaplink_S3"; // Replace with actual user logic

    // Insert the user name and the reference to the image into the user table
    await sql('INSERT INTO "photos" (name, image) VALUES ($1, $2)', [
      user,
      objectUrl,
    ]);

    // Revalidate the home path
    revalidatePath("/");
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}
