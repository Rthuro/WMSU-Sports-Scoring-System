import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM match_points ORDER BY set_number DESC`;
}

export async function findByMatch(matchId) {
  return await sql`SELECT * FROM match_points WHERE match_id = ${matchId} ORDER BY set_number DESC, time DESC`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO match_points (match_id, team_a_id, team_b_id, player_a_id, player_b_id, a_score, b_score, set_number, time)
    VALUES (${data.match_id}, ${data.team_a_id}, ${data.team_b_id}, ${data.player_a_id}, ${data.player_b_id}, ${data.a_score}, ${data.b_score}, ${data.set_number}, ${data.time})
    RETURNING *
  `;
  return result[0];
}

export async function update(data) {
  const result = await sql`
    UPDATE match_points
    SET match_id = ${data.match_id}, team_a_id = ${data.team_a_id}, team_b_id = ${data.team_b_id},
        player_a_id = ${data.player_a_id}, player_b_id = ${data.player_b_id},
        a_score = ${data.a_score}, b_score = ${data.b_score}, set_number = ${data.set_number}, time = ${data.time}
    WHERE entry_id = ${data.entry_id}
    RETURNING *
  `;
  return result[0] || null;
}
