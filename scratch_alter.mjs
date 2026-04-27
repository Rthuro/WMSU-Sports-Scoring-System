import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

import { sql } from "./backend/config/db.js";

async function alterTable() {
  try {
    console.log("Altering middle_name column to VARCHAR(50) and DROP NOT NULL...");
    await sql`ALTER TABLE accounts ALTER COLUMN middle_name TYPE VARCHAR(50)`;
    await sql`ALTER TABLE accounts ALTER COLUMN middle_name DROP NOT NULL`;
    console.log("Successfully altered accounts table.");
    process.exit(0);
  } catch (err) {
    console.error("Error altering table:", err);
    process.exit(1);
  }
}

alterTable();
