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
  await txSql`BEGIN`;

  try {
    const [team] = await txSql`
      INSERT INTO teams (event_id, department_id, sport_id, name, short_name, banner_image)
      VALUES (${data.event_id || null}, ${data.department_id || null}, ${data.sport_id}, ${data.name}, ${data.short_name || null}, ${data.banner_image || null})
      RETURNING *
    `;

    const teamId = team.team_id;

    for (const playerId of data.players || []) {
      await txSql`
        INSERT INTO player_teams (player_id, team_id, position_id, jersey_number) 
        VALUES (${playerId}, ${teamId}, null, null)
      `;
    }

    await txSql`COMMIT`;
    return team;

  } catch (error) {
    await txSql`ROLLBACK`;
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

export async function findProfileById(type, id) {
  const [team] = await sql`
    SELECT 
      t.*, 
      e.name AS event_name, 
      d.name AS department_name,
      s.name AS sport_name
    FROM teams t
    LEFT JOIN events e ON t.event_id = e.event_id
    LEFT JOIN departments d ON t.department_id = d.department_id
    LEFT JOIN sports s ON t.sport_id = s.sport_id
    WHERE t.team_id = ${id}
  `;

  if (!team) return null;

  // 1. Players
  const players = await sql`
    SELECT p.*, pt.position_id, pt.jersey_number 
    FROM player_teams pt
    JOIN players p ON pt.player_id = p.player_id
    WHERE pt.team_id = ${id} AND p.is_deleted = false
  `;

  // 2. Tournaments & Tally
  const tournaments = await sql`
    SELECT tr.*, tt.wins, tt.losses, e.name AS event_name
    FROM tournament_teams tteam
    JOIN tournaments tr ON tteam.tournament_id = tr.tournament_id
    LEFT JOIN tournament_tally tt ON tt.tournament_id = tr.tournament_id AND tt.team_id = tteam.team_id
    LEFT JOIN events e ON tr.event_id = e.event_id
    WHERE tteam.team_id = ${id}
  `;

  // 3. Matches involving this team
  const matches = type == 'tournament' ? await sql`
    SELECT tm.*, tr.name AS tournament_name, tr.bracketing,
      ta.name AS team_a_name, tb.name AS team_b_name
    FROM tournament_matches tm
    JOIN tournaments tr ON tm.tournament_id = tr.tournament_id
    LEFT JOIN teams ta ON tm.team_a_id = ta.team_id
    LEFT JOIN teams tb ON tm.team_b_id = tb.team_id
    WHERE tm.team_a_id = ${id} OR tm.team_b_id = ${id}
    ORDER BY tm.date DESC, tm.start_time DESC
  ` : await sql`
    SELECT m.*, s.name AS sport_name,
      ta.name AS team_a_name, tb.name AS team_b_name
    FROM matches m
    JOIN sports s ON m.sport_id = s.sport_id
    LEFT JOIN teams ta ON m.team_a_id = ta.team_id
    LEFT JOIN teams tb ON m.team_b_id = tb.team_id
    WHERE m.team_a_id = ${id} OR m.team_b_id = ${id}
    ORDER BY m.date DESC, m.start_time DESC
  `;

  return {
    ...team,
    players,
    tournaments,
    matches
  };
}

