"use server";

import { revalidatePath } from "next/cache";
import { neon } from "@neondatabase/serverless";
import { User } from "./definitions";

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

export async function createUser(user: User) {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");

  const sql = neon(process.env.DATABASE_URL);

  try {
    // Create the users table if it doesn't exist
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
      WHERE email = ${user.email}
    `;

    if (existingUser.length > 0) {
      console.log("User already exists:", existingUser[0].id);
      return; // Exit if the user exists
    }

    // Insert the user if they don't exist
    await sql`
    INSERT INTO "users" (name, email, image) 
    VALUES (${user.name}, ${user.email}, ${user.image})
  `;
    console.log("User created:", user.email);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}
