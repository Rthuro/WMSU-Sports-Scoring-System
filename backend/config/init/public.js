import { sql } from "../db.js"; 

export async function initArticlesTable(){
    try {
        await sql`
        
        CREATE TABLE IF NOT EXISTS articles (
            article_id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            content TEXT,
            image TEXT,
            link TEXT,
            is_public BOOLEAN DEFAULT TRUE,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        console.log("✅ articles table initialized");

    } catch (error) {
        console.error("❌ Failed to initialize articles table:", error);
    }
}