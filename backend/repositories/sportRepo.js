import { sql } from "../config/db.js";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

/**
 * Creates a sport along with all its sub-resources in a single transaction.
 * If any insert fails, everything is rolled back.
 */
export async function createWithSubResources(data) {
  const txSql = neon(connectionString, { fullResults: false });

  // Use a transaction via raw SQL
  await txSql("BEGIN");

  try {
    // 1. Insert the sport
    const [sport] = await txSql(
      `INSERT INTO sports (name, icon_path, scoring_type, default_sets, max_sets, max_score, timePerSet, min_players, max_players, use_set_based_scoring, has_penalty_affects_score, has_set_lineup)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [data.name, data.iconPath, data.scoringType, data.defaultSets, data.maxSets, data.maxScore, data.timePerSet, data.minPlayers, data.maxPlayers, data.useSetBasedScoring, data.hasPenaltyAffectsScore, data.hasSetLineUp]
    );

    const sportId = sport.sport_id;

    // 2. Insert set rules
    for (const rule of data.set_rules || []) {
      await txSql(
        `INSERT INTO set_rules (sport_id, set_number, max_score, time_limit) VALUES ($1, $2, $3, $4)`,
        [sportId, rule.set_number, rule.max_score || null, rule.time || rule.time_limit || null]
      );
    }

    // 3. Insert scoring points
    for (const point of data.scoring_points || []) {
      await txSql(
        `INSERT INTO scoring_points (sport_id, point) VALUES ($1, $2)`,
        [sportId, point]
      );
    }

    // 4. Insert penalties
    for (const penalty of data.penalties || []) {
      await txSql(
        `INSERT INTO penalty_types (sport_id, penalty_name, description, penalty_point, affects_score, penalty_limit) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sportId, penalty.penalty_name, penalty.description || "", penalty.penalty_point, penalty.affects_score || false, penalty.penalty_limit || null]
      );
    }

    // 5. Insert stats
    for (const stat of data.stats || []) {
      await txSql(
        `INSERT INTO stats (sport_id, stats_name, is_player_stat) VALUES ($1, $2, $3)`,
        [sportId, stat.stats_name, stat.is_player_stat || false]
      );
    }

    // 6. Insert positions
    for (const position of data.positions || []) {
      await txSql(
        `INSERT INTO sports_position (sport_id, position_name) VALUES ($1, $2)`,
        [sportId, position]
      );
    }

    await txSql("COMMIT");
    return sport;

  } catch (error) {
    await txSql("ROLLBACK");
    throw error;
  }
}

export async function findAll() {
  return await sql`SELECT * FROM sports WHERE is_deleted = false ORDER BY created_at DESC`;
}

export async function findById(id) {
  const result = await sql`SELECT * FROM sports WHERE sport_id = ${id} AND is_deleted = false`;
  return result[0] || null;
}

export async function findByName(name) {
  const result = await sql`SELECT * FROM sports WHERE name = ${name} AND is_deleted = false`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO sports (name, icon_path, scoring_type, default_sets, max_sets, max_score, timePerSet, min_players, max_players, use_set_based_scoring, has_penalty_affects_score, has_set_lineup)
    VALUES (${data.name}, ${data.iconPath}, ${data.scoringType}, ${data.defaultSets}, ${data.maxSets}, ${data.maxScore}, ${data.timePerSet}, ${data.minPlayers}, ${data.maxPlayers}, ${data.useSetBasedScoring}, ${data.hasPenaltyAffectsScore}, ${data.hasSetLineUp})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE sports
    SET name=${data.name}, icon_path=${data.iconPath},
    scoring_type=${data.scoringType}, default_sets=${data.defaultSets}, max_sets=${data.maxSets},
    max_score=${data.maxScore}, timePerSet=${data.timePerSet}, min_players=${data.minPlayers}, max_players=${data.maxPlayers}, use_set_based_scoring=${data.useSetBasedScoring}, has_penalty_affects_score=${data.hasPenaltyAffectsScore}, has_set_lineup=${data.hasSetLineUp}, updated_at=CURRENT_TIMESTAMP
    WHERE sport_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE sports SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE sport_id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}
