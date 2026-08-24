import { sql } from "../../config/db.js";
import { deleteImage } from "../../controllers/uploadController.js";

export async function findAll() {
    return await sql`SELECT * FROM articles ORDER BY created_at DESC`;
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
        INSERT INTO articles (articletype_id, title, content, image, link, is_public, is_featured, is_deleted, created_at, updated_at)
        VALUES (${data.articleType_id}, ${data.title}, ${data.content}, ${data.image}, ${data.link}, ${data.is_public}, ${data.is_featured}, ${data.is_deleted}, ${data.created_at}, ${data.updated_at})
        RETURNING *
    `;
    return result[0];
}

export async function findFeatured() {
    return await sql`SELECT * FROM articles WHERE is_deleted = false AND is_public = true AND is_featured = true ORDER BY created_at DESC`;
}

export async function update(id, data) {
    const result = await sql`
        UPDATE articles
        SET articletype_id = COALESCE(${data.articleType_id}, articletype_id),
            title = COALESCE(${data.title}, title),
            content = COALESCE(${data.content}, content),
            image = COALESCE(${data.image}, image),
            link = COALESCE(${data.link}, link),
            is_public = COALESCE(${data.is_public}, is_public),
            is_featured = COALESCE(${data.is_featured}, is_featured),
            is_deleted = COALESCE(${data.is_deleted}, is_deleted),
            updated_at = CURRENT_TIMESTAMP
        WHERE article_id = ${id}
        RETURNING *
    `;
    return result[0] || null;
}

export async function deleteArticle(id) {
    const result = await sql`DELETE FROM articles WHERE article_id = ${id} RETURNING *`;
     console.log(result[0])
    return result[0] || null;
}