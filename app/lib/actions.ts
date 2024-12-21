"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { User } from "./definitions";

export async function uploadImage(objectUrl: string, userId: number) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Ensure the photos table exists with the user relationship
    await sql(`
      CREATE TABLE IF NOT EXISTS "photos" (
        id SERIAL PRIMARY KEY,
        name TEXT,
        image TEXT,
        user_id INT REFERENCES "users"(id) ON DELETE CASCADE
      )
    `);

    // Fetch the username from the users table
    const userResult = await sql`
      SELECT name FROM "users" WHERE id = ${userId}
    `;

    if (userResult.length === 0) {
      throw new Error(`No user found with ID: ${userId}`);
    }

    const userName = userResult[0].name;

    // Insert the image with the associated user ID and username
    await sql(
      'INSERT INTO "photos" (name, image, user_id) VALUES ($1, $2, $3)',
      [userName, objectUrl, userId]
    );

    // Revalidate the home path
    revalidatePath("/");
  } catch (error) {
    console.error("Error uploading image:", error);
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
