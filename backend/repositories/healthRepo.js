import { sql } from "../config/db.js";

export async function getHealth() {
    try {
        await sql`SELECT 1`;
        return { status: "ok" };
    } catch (error) {
        console.error("Health check error:", error);
        return { status: "error" };
    }
}