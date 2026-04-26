import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM player_stats`;
}

export async function findMultiple(playerIdsString) {
  const playerIds = playerIdsString.split(',').map(id => parseInt(id.trim(), 10)).filter(id => !isNaN(id));

  if (playerIds.length === 0) return [];

  return await sql`SELECT ps.*, CONCAT(p.first_name, ' ', p.last_name) AS player_name, s.*,t.name as team_name
  FROM player_stats ps
  JOIN stats s ON ps.stats_id = s.stats_id
  JOIN players p ON ps.player_id = p.player_id
  JOIN teams t ON ps.team_id = t.team_id
  WHERE ps.player_id = ANY(${playerIds})`;
}



export async function findByMatch(matchId) {
  return await sql`SELECT ps.*, CONCAT(p.first_name, ' ', p.last_name) AS player_name, s.*
  FROM player_stats ps
  JOIN stats s ON ps.stats_id = s.stats_id
  JOIN players p ON ps.player_id = p.player_id
  WHERE ps.match_id = ${matchId}`;
}

export async function findByPlayer(playerId) {
  return await sql`SELECT * FROM player_stats WHERE player_id = ${playerId}`;
}

export async function findByMatchAndPlayer(matchId, playerId) {
  return await sql`SELECT * FROM player_stats WHERE match_id = ${matchId} AND player_id = ${playerId}`;
}

export async function create(data) {
  const result = await sql`
      INSERT INTO player_stats (player_id, match_id, team_id, stats_id, set_number, value)
      VALUES (${data.player_id}, ${data.match_id}, ${data.team_id}, ${data.stats_id}, ${data.set_number || 1}, ${data.value})
      RETURNING *
  `;
  return result;
}

export async function update(id, data) {
  const result = await sql`
    UPDATE player_stats
    SET value = COALESCE(${data.value}, value)
    WHERE entry_id = ${id}
    RETURNING *
  `;
  return result;
}

export async function deleteRecord(id) {
  return await sql`
    DELETE FROM player_stats
    WHERE entry_id = ${id}
    RETURNING *
  `;
}
