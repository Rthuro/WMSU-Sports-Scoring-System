import { sql } from "../../config/db.js";

export async function findAll() {
    return await sql`SELECT * FROM player_penalties`;
}

export async function findByMatch(matchId) {
    return await sql`SELECT * FROM player_penalties WHERE match_id = ${matchId}`;
}

export async function findByPlayer(playerId) {
    return await sql`SELECT * FROM player_penalties WHERE player_id = ${playerId}`;
}

export async function findByMatchAndPlayer(matchId, playerId) {
    return await sql`SELECT * FROM player_penalties WHERE match_id = ${matchId} AND player_id = ${playerId}`;
}

export async function create(data) {
    return await sql`INSERT INTO player_penalties ${sql(data, 'player_id', 'match_id', 'penalty_id', 'set_number', 'value')}`;
}

export async function update(id, data) {
    return await sql`
    UPDATE player_penalties
    SET ${sql(data, 'value')}
    WHERE entry_id = ${id}
    RETURNING *
  `;
}

export async function deleteRecord(id) {
    return await sql`
    DELETE FROM player_penalties
    WHERE entry_id = ${id}
    RETURNING *
  `;
}
