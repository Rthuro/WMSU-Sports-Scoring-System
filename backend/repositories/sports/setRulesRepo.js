import { sql } from "../../config/db.js";

export async function findBySport(sportId) {
  return await sql`SELECT * FROM set_rules WHERE sport_id = ${sportId}`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO set_rules (sport_id, set_number, max_score, time_limit)
    VALUES (${data.sportId}, ${data.set_number}, ${data.max_score}, ${data.time_limit}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE set_rules SET set_number = ${data.set_number}, max_score = ${data.max_score}, time_limit = ${data.time_limit}
    WHERE set_rule_id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM set_rules WHERE set_rule_id = ${id} RETURNING *`;
  return result[0] || null;
}
