import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM player_stats`;
}

export async function findByMatch(matchId) {
  return await sql`SELECT * FROM player_stats WHERE match_id = ${matchId}`;
}
