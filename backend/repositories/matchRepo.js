import { sql } from "../config/db.js";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

/**
 * Creates a match along with its participants in a single transaction.
 */
export async function createWithParticipants(data) {
  const txSql = neon(connectionString, { fullResults: false });
  await txSql("BEGIN");

  try {
    const [match] = await txSql(
      `INSERT INTO matches (match_id, sport_id, match_name, match_date, start_time, end_time, location, is_team, team_a_id, team_b_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [data.match_id, data.sport_id, data.match_name, data.match_date, data.start_time, data.end_time, data.location, data.is_team, data.team_a_id, data.team_b_id]
    );

    // Insert participants
    for (const participant of data.participants || []) {
      await txSql(
        `INSERT INTO match_participants (match_id, team_id, player_id) VALUES ($1, $2, $3)`,
        [data.match_id, participant.team_id || null, participant.player_id || null]
      );
    }

    // If no explicit participants but team_a and team_b exist, auto-create
    if ((!data.participants || data.participants.length === 0) && data.team_a_id && data.team_b_id) {
      if (data.is_team) {
        await txSql(`INSERT INTO match_participants (match_id, team_id) VALUES ($1, $2)`, [data.match_id, data.team_a_id]);
        await txSql(`INSERT INTO match_participants (match_id, team_id) VALUES ($1, $2)`, [data.match_id, data.team_b_id]);
      } else {
        await txSql(`INSERT INTO match_participants (match_id, player_id) VALUES ($1, $2)`, [data.match_id, data.team_a_id]);
        await txSql(`INSERT INTO match_participants (match_id, player_id) VALUES ($1, $2)`, [data.match_id, data.team_b_id]);
      }
    }

    await txSql("COMMIT");
    return match;

  } catch (error) {
    await txSql("ROLLBACK");
    throw error;
  }
}

export async function findAll() {
  return await sql`SELECT * FROM matches ORDER BY match_date DESC`;
}

export async function findById(matchId) {
  const result = await sql`SELECT * FROM matches WHERE match_id = ${matchId}`;
  return result[0] || null;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM matches WHERE sport_id = ${sportId} AND is_deleted = false ORDER BY match_date DESC`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO matches (match_id, sport_id, match_name, match_date, start_time, end_time, location, is_team, team_a_id, team_b_id)
    VALUES (${data.match_id}, ${data.sport_id}, ${data.match_name}, ${data.match_date}, ${data.start_time}, ${data.end_time}, ${data.location}, ${data.is_team}, ${data.team_a_id}, ${data.team_b_id})
    RETURNING *
  `;
  return result[0];
}

export async function update(matchId, data) {
  const result = await sql`
    UPDATE matches
    SET match_name = ${data.match_name}, match_date = ${data.match_date},
        start_time = ${data.start_time}, end_time = ${data.end_time},
        location = ${data.location}, is_finished = ${data.is_finished},
        updated_at = CURRENT_TIMESTAMP
    WHERE match_id = ${matchId} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(matchId) {
  const result = await sql`
    UPDATE matches SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE match_id = ${matchId}
    RETURNING *
  `;
  return result[0] || null;
}
