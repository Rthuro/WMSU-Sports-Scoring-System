import { sql } from "../../config/db.js";

export async function findBySport(sportId) {
  return await sql`SELECT * FROM sports_position WHERE sport_id = ${sportId}`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO sports_position (sport_id, position_name) VALUES (${data.sportId}, ${data.position_name}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE sports_position SET position_name = ${data.position_name} WHERE id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM sports_position WHERE id = ${id} RETURNING *`;
  return result[0] || null;
}
