import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM accounts WHERE is_deleted = false ORDER BY created_at DESC`;
}

export async function findByEmail(email) {
  const result = await sql`
    SELECT * FROM accounts WHERE email = ${email} AND is_deleted = false
  `;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO accounts (first_name, last_name, middle_name, role, email, password_hash)
    VALUES (${data.firstName}, ${data.lastName}, ${data.middleName}, ${data.role}, ${data.email}, ${data.passwordHash})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE accounts
    SET first_name=${data.firstName}, last_name=${data.lastName},
    middle_name=${data.middleName}, role=${data.role}, email=${data.email}, password_hash=${data.passwordHash}
    WHERE account_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE accounts SET is_deleted = true WHERE account_id = ${id} RETURNING *
  `;
  return result[0] || null;
}
