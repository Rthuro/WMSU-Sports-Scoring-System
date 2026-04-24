import { sql } from "../../config/db.js";

export async function findAll() {
    return await sql`SELECT * FROM player_penalties`;
}

export async function findByMatch(matchId) {
    return await sql`SELECT pp.*, CONCAT(p.first_name, ' ', p.last_name) AS player_name, ptype.*
    FROM player_penalties pp
    JOIN penalty_types ptype ON pp.penalty_id = ptype.penalty_id
    JOIN players p ON pp.player_id = p.player_id
    WHERE pp.match_id = ${matchId}`;
}

export async function findByPlayer(playerId) {
    return await sql`SELECT * FROM player_penalties WHERE player_id = ${playerId}`;
}

export async function findByMatchAndPlayer(matchId, playerId) {
    return await sql`SELECT * FROM player_penalties WHERE match_id = ${matchId} AND player_id = ${playerId}`;
}

export async function create(data) {
    const result = await sql`
        INSERT INTO player_penalties (player_id, match_id, team_id, penalty_id, set_number, value)
        VALUES (${data.player_id}, ${data.match_id}, ${data.team_id}, ${data.penalty_id}, ${data.set_number || 1}, ${data.value})
        RETURNING *
    `;
    return result;
}

export async function update(id, data) {
    const result = await sql`
        UPDATE player_penalties
        SET value = COALESCE(${data.value}, value)
        WHERE entry_id = ${id}
        RETURNING *
    `;
    return result;
}

export async function deleteRecord(id) {
    return await sql`
    DELETE FROM player_penalties
    WHERE entry_id = ${id}
    RETURNING *
  `;
}
