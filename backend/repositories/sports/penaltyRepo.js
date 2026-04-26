import { sql } from "../../config/db.js";

export async function findBySport(sportId) {
  return await sql`SELECT * FROM penalty_types WHERE sport_id = ${sportId}`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO penalty_types (sport_id, penalty_name, description, penalty_point, affects_score, penalty_limit)
    VALUES (${data.sport_id}, ${data.penalty_name}, ${data.description}, ${data.penalty_point}, ${data.affects_score}, ${data.penalty_limit})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE penalty_types
    SET penalty_name = COALESCE(${data.penalty_name}, penalty_name), description = COALESCE(${data.description}, description),
        penalty_point = COALESCE(${data.penalty_point}, penalty_point), affects_score = COALESCE(${data.affects_score}, affects_score), penalty_limit = COALESCE(${data.penalty_limit}, penalty_limit)
    WHERE penalty_id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM penalty_types WHERE penalty_id = ${id} RETURNING *`;
  return result[0] || null;
}
