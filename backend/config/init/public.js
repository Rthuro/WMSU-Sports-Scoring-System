import { sql } from "../db.js"; 

export async function initArticlesTable(){
    try {
        await sql`
        
        CREATE TABLE IF NOT EXISTS articles (
            article_id SERIAL PRIMARY KEY,
            articleType_id INTEGER REFERENCES articleType(articleType_id),
            title TEXT NOT NULL,
            content TEXT,
            image TEXT,
            link TEXT,
            is_public BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        await sql` ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE`;
        await sql` ALTER TABLE articles ADD COLUMN IF NOT EXISTS video TEXT`;
        await sql` ALTER TABLE articles ADD COLUMN IF NOT EXISTS articleType_id INTEGER REFERENCES articleType(articleType_id)`;
        console.log("✅ articles table initialized");

    } catch (error) {
        console.error("❌ Failed to initialize articles table:", error);
    }
}

export async function initArticleTypeTable(){
    try {
        await sql`
        
        CREATE TABLE IF NOT EXISTS articleType (
            articleType_id SERIAL PRIMARY KEY,
            article_type TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        
        try {
            await sql`ALTER TABLE articleType ADD CONSTRAINT article_type_unique UNIQUE (article_type)`;
        } catch (e) {
            // Ignore error if constraint already exists
        }

        await sql `INSERT INTO articleType (article_type) VALUES ('news'), ('event'), ('announcement'), ('other') ON CONFLICT (article_type) DO NOTHING RETURNING *`
        console.log("✅ articleType table initialized");

    } catch (error) {
        console.error("❌ Failed to initialize articleType table:", error);
    }
}

export async function initWebsiteSettingsTable() {
    try {
        await sql`
        
        CREATE TABLE IF NOT EXISTS website_settings (
            website_setting_id SERIAL PRIMARY KEY,
            header_image TEXT,
            hero_title TEXT,
            hero_subtitle TEXT,
            hero_text TEXT,
            footer_image TEXT,
            is_public BOOLEAN DEFAULT TRUE,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        console.log("✅ website_settings table initialized");
    } catch (error) {
        console.error("❌ Failed to initialize website_settings table:", error);
    }
}