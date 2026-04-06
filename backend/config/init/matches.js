import { sql } from "../db.js";

export async function initMatchesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
      match_id TEXT PRIMARY KEY,
      sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
      match_name VARCHAR(255),
      match_date date,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      location VARCHAR(255),
      is_team BOOLEAN DEFAULT TRUE,
      team_a_id INT REFERENCES teams(team_id),
      team_b_id INT REFERENCES teams(team_id),
      is_finished BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ matches table initialized");
  } catch (error) {
    console.error("❌ Error initializing matches table:", error);
  }
}

export async function initMatchParticipantsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS match_participants (
        id SERIAL PRIMARY KEY,
        match_id TEXT NOT NULL,
        team_id INT REFERENCES teams(team_id),
        player_id INT REFERENCES players(player_id),
        is_winner BOOLEAN DEFAULT FALSE,
        is_losser BOOLEAN DEFAULT FALSE     
      )
    `;
    console.log("✅ match_participants table initialized");
  } catch (error) {
    console.error("❌ Error initializing match_participants table:", error);
  }
}

export async function initMatchPoints() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS match_points (
        entry_id SERIAL PRIMARY KEY,
        match_id TEXT NOT NULL,
        team_a_id INT REFERENCES teams(team_id),
        team_b_id INT REFERENCES teams(team_id),
        player_a_id INT REFERENCES players(player_id),
        player_b_id INT REFERENCES players(player_id),
        a_score INT NOT NULL,
        b_score INT NOT NULL,
        set_number INT NOT NULL,
        time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
    `;
    console.log("✅ match_points table initialized");
  } catch (error) {
    console.error("❌ Error initializing match_participants table:", error);
  }
}