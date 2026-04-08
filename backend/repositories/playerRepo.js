import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM players WHERE is_deleted = false`;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM players WHERE sport_id = ${sportId} AND is_deleted = false`;
}

export async function findByName(firstName, lastName) {
  const result = await sql`SELECT * FROM players WHERE first_name = ${firstName} AND last_name = ${lastName} AND is_deleted = false`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO players (sport_id, first_name, last_name, middle_initial, gender, student_id, photo)
    VALUES (${data.sport_id}, ${data.first_name}, ${data.last_name}, ${data.middle_initial}, ${data.gender}, ${data.student_id}, ${data.photo})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE players
    SET sport_id = ${data.sport_id}, first_name = ${data.first_name}, last_name = ${data.last_name},
        middle_initial = ${data.middle_initial}, gender = ${data.gender},
        student_id = ${data.student_id}, photo = ${data.photo}
    WHERE player_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE players SET is_deleted = true WHERE player_id = ${id} RETURNING *
  `;
  return result[0] || null;
}
