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
  await txSql`BEGIN`;

  try {
    const [match] = await txSql`
      INSERT INTO matches (match_id, sport_id, match_name, date, start_time, end_time, location, is_team, team_a_id, team_b_id, player_a_id, player_b_id)
      VALUES (${data.match_id}, ${data.sport_id}, ${data.match_name}, ${data.date}, ${data.start_time}, ${data.end_time}, ${data.location}, ${data.is_team}, ${data.team_a_id}, ${data.team_b_id}, ${data.player_a_id}, ${data.player_b_id})
      RETURNING *
    `;

    for (const participant of data.participants || []) {
      await txSql`INSERT INTO match_participants (match_id, team_id, player_id) VALUES (${data.match_id}, ${participant.team_id || null}, ${participant.player_id || null})`;
    }

    if ((!data.participants || data.participants.length === 0) && data.team_a_id && data.team_b_id) {
      if (data.is_team) {
        await txSql`INSERT INTO match_participants (match_id, team_id) VALUES (${data.match_id}, ${data.team_a_id})`;
        await txSql`INSERT INTO match_participants (match_id, team_id) VALUES (${data.match_id}, ${data.team_b_id})`;
      } else {
        await txSql`INSERT INTO match_participants (match_id, player_id) VALUES (${data.match_id}, ${data.team_a_id})`;
        await txSql`INSERT INTO match_participants (match_id, player_id) VALUES (${data.match_id}, ${data.team_b_id})`;
      }
    }

    if (!data.is_team && data.player_a_id && data.player_b_id) {
      await txSql`INSERT INTO match_participants (match_id, player_id) VALUES (${data.match_id}, ${data.player_a_id})`;
      await txSql`INSERT INTO match_participants (match_id, player_id) VALUES (${data.match_id}, ${data.player_b_id})`;
    }

    await txSql`COMMIT`;
    return match;

  } catch (error) {
    await txSql`ROLLBACK`;
    throw error;
  }
}

export async function findAll() {
  return await sql`SELECT * FROM matches ORDER BY date DESC`;
}

export async function findById(matchId) {
  const result = await sql`SELECT * FROM matches WHERE match_id = ${matchId}`;
  return result[0] || null;
}

export async function findBySport(sportId) {
  return await sql`
  SELECT m.*,
  team_a.name AS team_a,
  team_b.name AS team_b,
  CONCAT(player_a.first_name, ' ', player_a.last_name) AS player_a,
  CONCAT(player_b.first_name, ' ', player_b.last_name) AS player_b
  FROM matches m
  LEFT JOIN teams team_a ON m.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON m.team_b_id = team_b.team_id
  LEFT JOIN players player_a ON m.player_a_id = player_a.player_id
  LEFT JOIN players player_b ON m.player_b_id = player_b.player_id
  WHERE m.sport_id = ${sportId} ORDER BY m.date DESC`;
}

export async function findByDateRange(startDate, endDate) {
  const matches = await sql`
  SELECT m.*,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo,
    sports.name AS sports_category
  FROM matches m
  LEFT JOIN teams team_a ON m.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON m.team_b_id = team_b.team_id
  LEFT JOIN sports ON m.sport_id = sports.sport_id
  WHERE m.date >= ${startDate} AND m.date <= ${endDate} AND m.is_deleted = false
  ORDER BY m.date ASC, m.start_time ASC`;

  const tournaments = await sql`
  SELECT 
    t.*,
    s.name AS sport_name,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo
  FROM tournament_matches t
  LEFT JOIN teams team_a ON t.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON t.team_b_id = team_b.team_id
  LEFT JOIN sports s ON t.sport_id = s.sport_id
  WHERE t.date >= ${startDate} AND t.date <= ${endDate} AND t.is_deleted = false
   ORDER BY t.date ASC, t.start_time ASC`;

  return {
    matches,
    tournaments
  };
}

export async function create(data) {
  const result = await sql`
    INSERT INTO matches (match_id, sport_id, match_name, date, start_time, end_time, location, is_team, team_a_id, team_b_id, player_a_id, player_b_id)
    VALUES (${data.match_id}, ${data.sport_id}, ${data.match_name}, ${data.date}, ${data.start_time}, ${data.end_time}, ${data.location}, ${data.is_team}, ${data.team_a_id}, ${data.team_b_id}, ${data.player_a_id}, ${data.player_b_id})
    RETURNING *
  `;
  return result[0];
}

export async function update(matchId, data) {
  const result = await sql`
    UPDATE matches
    SET match_name = COALESCE(${data.match_name ?? null}, match_name),
        date = COALESCE(${data.date ?? null}, date),
        start_time = COALESCE(${data.start_time ?? null}, start_time),
        end_time = COALESCE(${data.end_time ?? null}, end_time),
        location = COALESCE(${data.location ?? null}, location),
        is_finished = COALESCE(${data.is_finished ?? null}, is_finished),
        team_a_id = COALESCE(${data.team_a_id ?? null}, team_a_id),
        team_b_id = COALESCE(${data.team_b_id ?? null}, team_b_id),
        player_a_id = COALESCE(${data.player_a_id ?? null}, player_a_id),
        player_b_id = COALESCE(${data.player_b_id ?? null}, player_b_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE match_id = ${matchId}
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

export async function deleteMatch(matchId) {
  const result = await sql`
    DELETE FROM matches WHERE match_id = ${matchId}
    RETURNING *`;
  return result[0] || null;
}
