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
        bracketing VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
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
        round INT NOT NULL,
        is_finished BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
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
        wins INT DEFAULT 0,
        losses INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ tournament_tally table initialized");
  } catch (error) {
    console.error("❌ Error initializing tournament_tally table:", error);
  }
}