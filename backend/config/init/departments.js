import { sql } from "../db.js";

export async function initDepartmentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        department_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        abbreviation VARCHAR(50),
        logo TEXT,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ departments table created");
  } catch (error) {
    console.error("❌ Failed to create departments table:", error);
  }
}
