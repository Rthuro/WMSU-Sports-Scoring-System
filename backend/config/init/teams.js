import { sql } from "../db.js";

export async function initTeamsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS teams (
        team_id SERIAL PRIMARY KEY,
        event_id TEXT REFERENCES events(event_id) ON DELETE CASCADE,
        department_id INT REFERENCES departments(department_id) ON DELETE CASCADE,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50),
        banner_image TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_teams_sport_id ON teams(sport_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_teams_event_id ON teams(event_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_teams_department_id ON teams(department_id)`;
    console.log("✅ teams table initialized");
  } catch (error) {
    console.error("❌ Error initializing teams table:", error);
  }
}
