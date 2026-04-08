import { sql } from "../db.js";

export async function initPlayersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        player_id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        middle_initial VARCHAR(10),
        gender VARCHAR(10) CHECK (gender IN ('Male', 'Female')),
        student_id VARCHAR(50),
        photo TEXT,
        is_deleted BOOLEAN DEFAULT FALSE
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_players_sport_id ON players(sport_id)`;
    console.log("✅ players table initialized");
  } catch (error) {
    console.error("❌ Error initializing players table:", error);
  }
}

export async function initPlayerPenaltiesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS player_penalties (
        entry_id SERIAL PRIMARY KEY,
        player_id INT REFERENCES players(player_id) ON DELETE CASCADE,
        match_id TEXT REFERENCES matches(match_id) ON DELETE CASCADE,
        penalty_id INT REFERENCES penalty_types(penalty_id) ON DELETE SET NULL,
        set_number INT,
        value INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_penalties_player_id ON player_penalties(player_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_penalties_match_id ON player_penalties(match_id)`;
    console.log("✅ player_penalties table initialized");
  } catch (error) {
    console.error("❌ Error initializing player_penalties table:", error);
  }
}

export async function initPlayerStatsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS player_stats (
        entry_id SERIAL PRIMARY KEY,
        player_id INT REFERENCES players(player_id) ON DELETE CASCADE,
        match_id TEXT REFERENCES matches(match_id) ON DELETE CASCADE,
        stats_id INT REFERENCES stats(stats_id) ON DELETE SET NULL,
        set_number INT,
        value INT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats(player_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_stats_match_id ON player_stats(match_id)`;
    console.log("✅ player_stats table initialized");
  } catch (error) {
    console.error("❌ Error initializing player_stats table:", error);
  }
}

export async function initPlayerTeamsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS player_teams (
        id SERIAL PRIMARY KEY,
        player_id INT REFERENCES players(player_id) ON DELETE CASCADE,
        team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
        position_id INT REFERENCES sports_position(id),
        jersey_number INT
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_teams_player_id ON player_teams(player_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_player_teams_team_id ON player_teams(team_id)`;
    console.log("✅ player_teams table initialized");
  } catch (error) {
    console.error("❌ Error initializing player_teams table:", error);
  }
}
