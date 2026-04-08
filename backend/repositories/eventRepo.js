import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM events WHERE is_deleted = false ORDER BY created_at DESC`;
}

export async function findById(id) {
  const result = await sql`SELECT * FROM events WHERE event_id = ${id} AND is_deleted = false`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO events (event_id, name, description, start_date, end_date, location, banner_image)
    VALUES (${data.event_id}, ${data.name}, ${data.description}, ${data.start_date}, ${data.end_date}, ${data.location}, ${data.banner_image})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE events
    SET name=${data.name}, description=${data.description},
    start_date=${data.start_date}, end_date=${data.end_date}, location=${data.location}, banner_image=${data.banner_image},
    updated_at=CURRENT_TIMESTAMP
    WHERE event_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE events SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE event_id = ${id} RETURNING *
  `;
  return result[0] || null;
}
