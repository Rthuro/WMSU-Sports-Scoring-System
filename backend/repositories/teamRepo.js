import { sql } from "../config/db.js";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

/**
 * Creates a team along with player-team assignments in a single transaction.
 */
export async function createWithPlayers(data) {
  const txSql = neon(connectionString, { fullResults: false });
  await txSql("BEGIN");

  try {
    const [team] = await txSql(
      `INSERT INTO teams (event_id, department_id, sport_id, name, short_name, banner_image)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.event_id || null, data.department_id || null, data.sport_id, data.name, data.short_name || null, data.banner_image || null]
    );

    const teamId = team.team_id;

    for (const playerId of data.players || []) {
      await txSql(
        `INSERT INTO player_teams (player_id, team_id, position_id, jersey_number) VALUES ($1, $2, $3, $4)`,
        [playerId, teamId, null, null]
      );
    }

    await txSql("COMMIT");
    return team;

  } catch (error) {
    await txSql("ROLLBACK");
    throw error;
  }
}

export async function findAll() {
  return await sql`SELECT * FROM teams WHERE is_active = true AND is_deleted = false ORDER BY name`;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM teams WHERE sport_id = ${sportId} AND is_active = true AND is_deleted = false ORDER BY name`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO teams (event_id, department_id, sport_id, name, short_name, banner_image)
    VALUES (${data.event_id}, ${data.department_id}, ${data.sport_id}, ${data.name}, ${data.short_name}, ${data.banner_image})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE teams
    SET department_id = ${data.department_id}, sport_id = ${data.sport_id},
        name = ${data.name}, short_name = ${data.short_name},
        banner_image = ${data.banner_image}, is_active = ${data.is_active},
        updated_at = CURRENT_TIMESTAMP
    WHERE team_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE teams SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE team_id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}
