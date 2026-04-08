import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM departments WHERE is_deleted = false ORDER BY created_at DESC`;
}

export async function findById(id) {
  const result = await sql`SELECT * FROM departments WHERE department_id = ${id} AND is_deleted = false`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO departments (name, abbreviation, logo)
    VALUES (${data.name}, ${data.abbreviation}, ${data.logo})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE departments
    SET name=${data.name}, abbreviation=${data.abbreviation}, logo=${data.logo}, updated_at=CURRENT_TIMESTAMP
    WHERE department_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE departments SET is_deleted = true, updated_at = CURRENT_TIMESTAMP WHERE department_id = ${id} RETURNING *
  `;
  return result[0] || null;
}
