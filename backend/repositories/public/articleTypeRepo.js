import { sql } from "../../config/db.js";

export async function findAll() {
    return await sql`SELECT * FROM articleType ORDER BY created_at DESC`;
}

export async function findById(id) {
    const result = await sql`SELECT * FROM articleType WHERE articleType_id = ${id}`;
    return result[0] || null;
}

export async function create(data) {
    const result = await sql`
        INSERT INTO articleType (article_type)
        VALUES (${data.article_type})
        RETURNING *
    `;
    return result[0];
}

export async function update(id, data) {
    const result = await sql`
        UPDATE articleType
        SET article_type = COALESCE(${data.article_type}, article_type),
            updated_at = CURRENT_TIMESTAMP
        WHERE articleType_id = ${id}
        RETURNING *
    `;
    return result[0] || null;
}

export async function deleteArticleType(id) {
    const result = await sql`DELETE FROM articles WHERE articleType_id = ${id} RETURNING *`;
    return result[0] || null;
}