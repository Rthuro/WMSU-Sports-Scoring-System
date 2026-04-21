import { sql } from "../db.js";

export async function initMatchesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS matches (
      match_id TEXT PRIMARY KEY,
      sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
      match_name VARCHAR(255),
      date Date,
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      location VARCHAR(255) DEFAULT 'Not Set',
      is_team BOOLEAN DEFAULT TRUE,
      team_a_id INT REFERENCES teams(team_id) ON DELETE SET NULL,
      team_b_id INT REFERENCES teams(team_id) ON DELETE SET NULL,
      player_a_id INT REFERENCES players(player_id) ON DELETE SET NULL,
      player_b_id INT REFERENCES players(player_id) ON DELETE SET NULL,
      winner_id INT REFERENCES teams(team_id) DEFAULT NULL,
      is_finished BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS player_a_id INT REFERENCES players(player_id) ON DELETE SET NULL`;
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS player_b_id INT REFERENCES players(player_id) ON DELETE SET NULL`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_player_a_id ON matches(player_a_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_player_b_id ON matches(player_b_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_sport_id ON matches(sport_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_team_a_id ON matches(team_a_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_matches_team_b_id ON matches(team_b_id)`;
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS winner_id INT REFERENCES teams(team_id) DEFAULT NULL`;
    await sql`ALTER TABLE matches ADD COLUMN IF NOT EXISTS date Date`;
    await sql`ALTER TABLE matches DROP COLUMN IF EXISTS is_deleted`;
    await sql`ALTER TABLE matches DROP COLUMN IF EXISTS match_date`;
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
    await sql`CREATE INDEX IF NOT EXISTS idx_match_participants_match_id ON match_participants(match_id)`;
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
        a_score INT NOT NULL CHECK (a_score >= 0),
        b_score INT NOT NULL CHECK (b_score >= 0),
        set_number INT NOT NULL CHECK (set_number > 0),
        time TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_match_points_match_id ON match_points(match_id)`;
    console.log("✅ match_points table initialized");
  } catch (error) {
    console.error("❌ Error initializing match_points table:", error);
  }
}