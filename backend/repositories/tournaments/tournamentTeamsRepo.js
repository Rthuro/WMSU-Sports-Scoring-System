import { sql } from "../../config/db.js";

export async function findByTournament(tournamentId) {
  return await sql`SELECT * FROM tournament_teams WHERE tournament_id = ${tournamentId} ORDER BY tournament_team_id DESC`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO tournament_teams (tournament_id, team_id) VALUES (${data.tournament_id}, ${data.team_id}) RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE tournament_teams SET tournament_id = ${data.tournament_id}, team_id = ${data.team_id}
    WHERE tournament_team_id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM tournament_teams WHERE tournament_team_id = ${id} RETURNING *`;
  return result[0] || null;
}
