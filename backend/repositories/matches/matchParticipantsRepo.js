import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM match_participants`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO match_participants (match_id, team_id, player_id) VALUES (${data.match_id}, ${data.team_id}, ${data.player_id}) RETURNING *
  `;
  return result[0];
}
