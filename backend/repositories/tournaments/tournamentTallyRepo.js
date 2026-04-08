import { sql } from "../../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM tournament_tally`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO tournament_tally (tournament_id, team_id, wins, losses)
    VALUES (${data.tournament_id}, ${data.team_id}, ${data.wins || 0}, ${data.losses || 0}) RETURNING *
  `;
  return result[0];
}

export async function update(tournamentId, teamId, data) {
  const result = await sql`
    UPDATE tournament_tally
    SET wins = COALESCE(${data.wins}, wins), losses = COALESCE(${data.losses}, losses), updated_at = CURRENT_TIMESTAMP
    WHERE tournament_id = ${tournamentId} AND team_id = ${teamId}
    RETURNING *
  `;
  return result[0] || null;
}

export async function remove(tallyId) {
  const result = await sql`DELETE FROM tournament_tally WHERE tally_id = ${tallyId} RETURNING *`;
  return result[0] || null;
}
