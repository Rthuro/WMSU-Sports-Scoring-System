import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT account_id, first_name, last_name, middle_name, email, role, profile_image, created_at FROM accounts WHERE is_deleted = false ORDER BY created_at DESC`;
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
    RETURNING account_id, first_name, last_name, middle_name, email, role, profile_image, created_at
  `;
  return result[0];
}

export async function update(id, data) {
  const updateData = {};

  if (data.firstName !== undefined) updateData.first_name = data.firstName;
  if (data.lastName !== undefined) updateData.last_name = data.lastName;
  if (data.middleName !== undefined) updateData.middle_name = data.middleName;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.profileImage !== undefined) updateData.profile_image = data.profileImage;
  if (data.passwordHash !== undefined) updateData.password_hash = data.passwordHash;

  if (Object.keys(updateData).length === 0) {
    return null;
  }

  const result = await sql`
    UPDATE accounts
    SET first_name = COALESCE(${updateData.first_name}, first_name), 
    last_name = COALESCE(${updateData.last_name}, last_name), 
    middle_name = COALESCE(${updateData.middle_name}, middle_name), 
    email = COALESCE(${updateData.email}, email), 
    profile_image = COALESCE(${updateData.profile_image}, profile_image), 
    password_hash = COALESCE(${updateData.password_hash}, password_hash)
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
