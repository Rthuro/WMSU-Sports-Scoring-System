import { sql } from "../../config/db.js";

export async function findAll() {
    return await sql`SELECT * FROM articles WHERE is_deleted = false ORDER BY created_at DESC`;
}
export async function findAllPublic() {
    return await sql`SELECT * FROM articles WHERE is_deleted = false AND is_public = true ORDER BY created_at DESC`;
}

export async function findById(id) {
    const result = await sql`SELECT * FROM articles WHERE article_id = ${id} AND is_deleted = false`;
    return result[0] || null;
}

export async function create(data) {
    const result = await sql`
        INSERT INTO articles (title, content, image, link, is_public, is_deleted, created_at, updated_at)
        VALUES (${data.title}, ${data.content}, ${data.image}, ${data.link}, ${data.is_public}, ${data.is_deleted}, ${data.created_at}, ${data.updated_at})
        RETURNING *
    `;
    return result[0];
}

export async function update(id, data) {
    const result = await sql`
        UPDATE articles
        SET title = COALESCE(${data.title}, title),
            content = COALESCE(${data.content}, content),
            image = COALESCE(${data.image}, image),
            link = COALESCE(${data.link}, link),
            is_public = COALESCE(${data.is_public}, is_public),
            is_deleted = COALESCE(${data.is_deleted}, is_deleted),
            updated_at = CURRENT_TIMESTAMP
        WHERE article_id = ${id}
        RETURNING *
    `;
    return result[0] || null;
}

export async function deleteArticle(id) {
    const result = await sql`DELETE FROM articles WHERE article_id = ${id} RETURNING *`;
    return result[0] || null;
}