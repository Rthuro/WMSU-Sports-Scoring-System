import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM player_teams`;
}

export async function findByTeam(teamId) {
  return await sql`SELECT * FROM player_teams WHERE team_id = ${teamId}`;
}

export async function findByPlayerAndTeam(playerId, teamId) {
  const result = await sql`SELECT * FROM player_teams WHERE player_id = ${playerId} AND team_id = ${teamId}`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO player_teams (player_id, team_id, position_id, jersey_number)
    VALUES (${data.player_id}, ${data.team_id}, ${data.position_id}, ${data.jersey_number}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE player_teams SET player_id = ${data.player_id}, team_id = ${data.team_id},
    position_id = ${data.position_id}, jersey_number = ${data.jersey_number}
    WHERE id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM player_teams WHERE id = ${id} RETURNING *`;
  return result[0] || null;
}
