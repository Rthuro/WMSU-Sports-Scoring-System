import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM player_stats`;
}

export async function findByMatch(matchId) {
  return await sql`SELECT * FROM player_stats WHERE match_id = ${matchId}`;
}

export async function findByPlayer(playerId) {
  return await sql`SELECT * FROM player_stats WHERE player_id = ${playerId}`;
}

export async function findByMatchAndPlayer(matchId, playerId) {
  return await sql`SELECT * FROM player_stats WHERE match_id = ${matchId} AND player_id = ${playerId}`;
}

export async function create(data) {
  return await sql`INSERT INTO player_stats ${sql(data, 'player_id', 'match_id', 'stats_id', 'set_number', 'value')}`;
}

export async function update(id, data) {
  return await sql`
    UPDATE player_stats
    SET ${sql(data, 'value')}
    WHERE entry_id = ${id}
    RETURNING *
  `;
}

export async function deleteRecord(id) {
  return await sql`
    DELETE FROM player_stats
    WHERE entry_id = ${id}
    RETURNING *
  `;
}
