import { sql } from "../db.js";

export async function initStatsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS stats (
        stats_id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        stats_name VARCHAR(255),
        is_player_stat BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_stats_sport_id ON stats(sport_id)`;
    console.log("✅ stats table initialized");
  } catch (error) {
    console.error("❌ Error initializing stats table:", error);
  }
}