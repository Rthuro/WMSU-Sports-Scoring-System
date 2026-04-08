import { sql } from "../db.js"; 

// CREATE TYPE IF NOT EXISTS user_role AS ENUM ('super_admin', 'admin')

export async function initAccountsTable(){
    try {
        await sql`
        
        CREATE TABLE IF NOT EXISTS accounts (
            account_id SERIAL PRIMARY KEY,
            first_name VARCHAR(150) NOT NULL,
            last_name VARCHAR(150) NOT NULL,
            middle_name VARCHAR(5) NOT NULL,
            role VARCHAR(25) NOT NULL CHECK (role IN ('super_admin', 'admin')),
            email VARCHAR(255) NOT NULL,
            password_hash TEXT NOT NULL,
            is_deleted BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;

        console.log("✅ accounts table initialized");

    } catch (error) {
        console.error("❌ Failed to initialize accounts table:", error);
    }
}