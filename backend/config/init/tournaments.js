import { sql } from "../db.js";

export async function initTournamentsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tournaments (
        tournament_id TEXT PRIMARY KEY,
        event_id TEXT REFERENCES events(event_id) ON DELETE CASCADE,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        location VARCHAR(255),
        banner_image TEXT,
        bracketing VARCHAR(255) NOT NULL CHECK (bracketing IN ('single-elimination', 'double-elimination', 'round-robin')),
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournaments_event_id ON tournaments(event_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournaments_sport_id ON tournaments(sport_id)`;
    console.log("✅ tournaments table created");
  } catch (error) {
    console.error("❌ Failed to create tournaments table:", error);
  }
}

export async function initTournamentTeamsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tournament_teams (
        tournament_team_id SERIAL PRIMARY KEY,
        tournament_id TEXT REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
        team_id INT REFERENCES teams(team_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON tournament_teams(tournament_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournament_teams_team_id ON tournament_teams(team_id)`;
    console.log("✅ tournament_teams table initialized");
  } catch (error) {
    console.error("❌ Error initializing tournament_teams table:", error);
  }
}

export async function initTournamentMatchesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tournament_matches (
        match_id TEXT PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id),
        tournament_id TEXT REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
        match_name VARCHAR(255),
        date DATE,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        location VARCHAR(255),
        team_a_id INT REFERENCES teams(team_id),
        team_b_id INT REFERENCES teams(team_id),
        winner_id INT REFERENCES teams(team_id) DEFAULT NULL,
        round INT NOT NULL CHECK (round > 0),
        is_finished BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      )
    `;
    // Ensure winner_id exists if table was already created
    await sql`ALTER TABLE tournament_matches ADD COLUMN IF NOT EXISTS winner_id INT REFERENCES teams(team_id) DEFAULT NULL`;
    await sql`ALTER TABLE tournament_matches ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournament_matches_tournament_id ON tournament_matches(tournament_id)`;
    console.log("✅ tournament_matches table initialized");
  } catch (error) {
    console.error("❌ Error initializing tournament_matches table:", error);
  }
}

export async function initTournamentTallyTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tournament_tally (
        tally_id SERIAL PRIMARY KEY,
        tournament_id TEXT REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
        team_id INT REFERENCES teams(team_id),
        wins INT DEFAULT 0 CHECK (wins >= 0),
        losses INT DEFAULT 0 CHECK (losses >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_tournament_tally_tournament_id ON tournament_tally(tournament_id)`;
    console.log("✅ tournament_tally table initialized");
  } catch (error) {
    console.error("❌ Error initializing tournament_tally table:", error);
  }
}