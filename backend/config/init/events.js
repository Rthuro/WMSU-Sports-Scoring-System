import { sql } from "../db.js";

export async function initEventsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        event_id TEXT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        location VARCHAR(255),
        banner_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ events table created");

  } catch (error) {
    
    console.error("❌ Failed to create events table:", error);
  }
}

export async function initEventAwardsTable () {
   try {
      await sql `
        CREATE TABLE IF NOT EXISTS event_awards (
        award_id SERIAL PRIMARY KEY,
        event_id TEXT REFERENCES events(event_id) ON DELETE CASCADE,
        tournament_id TEXT REFERENCES tournaments(tournament_id),
        team_id INT REFERENCES teams(team_id),
        place VARCHAR(10),
        awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      `
    console.log("✅ event_awards table created");
   } catch (error) {
     console.error("❌ Failed to create event_awards table:", error);
   }
}
