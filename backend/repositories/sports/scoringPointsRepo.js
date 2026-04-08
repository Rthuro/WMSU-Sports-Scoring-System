import { sql } from "../../config/db.js";

export async function findBySport(sportId) {
  return await sql`SELECT * FROM scoring_points WHERE sport_id = ${sportId}`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO scoring_points (sport_id, point) VALUES (${data.sportId}, ${data.point}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE scoring_points SET point=${data.point} WHERE scoring_point_id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM scoring_points WHERE scoring_point_id = ${id} RETURNING *`;
  return result[0] || null;
}
