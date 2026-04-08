import { sql } from "../db.js";

export async function initSportsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sports (
        sport_id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        icon_path TEXT,
        scoring_type VARCHAR(100),
        default_sets INT NOT NULL,
        max_sets INT NOT NULL,
        min_players INT NOT NULL,
        max_players INT NOT NULL,
        timePerSet INTERVAL,
        max_score INT,
        use_set_based_scoring BOOLEAN DEFAULT FALSE,
        has_penalty_affects_score BOOLEAN DEFAULT FALSE,
        has_set_lineup BOOLEAN DEFAULT FALSE,
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ sports table initialized");
  } catch (error) {
    console.error("❌ Error initializing sports table:", error);
  }
}

export async function initScoringPointsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS scoring_points (
        scoring_point_id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        point INT NOT NULL
     )`;
    
    // FK index
    await sql`CREATE INDEX IF NOT EXISTS idx_scoring_points_sport_id ON scoring_points(sport_id)`;
    console.log("✅ scoring points table initialized");
  } catch (error) {
      console.error("❌ Error initializing scoring points table:", error);
  }
}

export async function initSetRulesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS set_rules (
        set_rule_id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        set_number INT NOT NULL CHECK (set_number > 0),
        max_score INT ,
        time_limit INTERVAL 
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_set_rules_sport_id ON set_rules(sport_id)`;
    console.log("✅ set_rules table initialized");
  } catch (error) {
    console.error("❌ Error initializing set_rules table:", error);
  }
}

export async function initPenaltyTypesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS penalty_types (
        penalty_id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        penalty_name VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        penalty_point INT NOT NULL,
        affects_score BOOLEAN DEFAULT FALSE,
        penalty_limit INT DEFAULT NULL
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_penalty_types_sport_id ON penalty_types(sport_id)`;
    console.log("✅ penalty_types table initialized");
  } catch (error) {
    console.error("❌ Error initializing penalty_types table:", error);
  }
}

export async function initSportsPositionTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS sports_position (
        id SERIAL PRIMARY KEY,
        sport_id INT REFERENCES sports(sport_id) ON DELETE CASCADE,
        position_name VARCHAR(155) NOT NULL
      )
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_sports_position_sport_id ON sports_position(sport_id)`;
    console.log("✅ sports_position table initialized");
  } catch (error) {
    console.error("❌ Error initializing sports_position table:", error);
  }
}
