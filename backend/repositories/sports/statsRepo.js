import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM stats`;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM stats WHERE sport_id = ${sportId}`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO stats (sport_id, stats_name, is_player_stat) VALUES (${data.sportId}, ${data.stats_name}, ${data.is_player_stat}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE stats SET stats_name = ${data.stats_name}, is_player_stat = ${data.is_player_stat} WHERE stats_id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM stats WHERE stats_id = ${id} RETURNING *`;
  return result[0] || null;
}
