import { sql } from "../../config/db.js";

export async function findByTournament(tournamentId) {
  return await sql`SELECT * FROM tournament_matches WHERE tournament_id = ${tournamentId} ORDER BY date DESC`;
}

export async function findById(matchId) {
  const result = await sql`SELECT * FROM tournament_matches WHERE match_id = ${matchId}`;
  return result[0] || null;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, date, start_time, end_time, location, team_a_id, team_b_id, winner_id, round)
    VALUES (${data.match_id}, ${data.sport_id}, ${data.tournament_id}, ${data.match_name}, ${data.date}, ${data.start_time}, ${data.end_time}, ${data.location}, ${data.team_a_id}, ${data.team_b_id}, ${data.winner_id}, ${data.round})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
    const teamA = (data.team_a_id === 'empty' || data.team_a_id === null) ? null : data.team_a_id;
    const teamB = (data.team_b_id === 'empty' || data.team_b_id === null) ? null : data.team_b_id;
    const winnerId = (data.winner_id === 'empty' || data.winner_id === null) ? null : data.winner_id;

    const result = await sql`
        UPDATE tournament_matches
        SET match_name = COALESCE(${data.match_name}, match_name),
            date = COALESCE(${data.date}, date),
            start_time = COALESCE(${data.start_time}, start_time),
            end_time = COALESCE(${data.end_time}, end_time),
            location = COALESCE(${data.location}, location),
            round = COALESCE(${data.round}, round),
            is_finished = COALESCE(${data.is_finished}, is_finished),
            team_a_id = CASE WHEN ${data.team_a_id !== undefined} THEN ${teamA}::int ELSE team_a_id END,
            team_b_id = CASE WHEN ${data.team_b_id !== undefined} THEN ${teamB}::int ELSE team_b_id END,
            winner_id = CASE WHEN ${data.winner_id !== undefined} THEN ${winnerId}::int ELSE winner_id END,
            updated_at = CURRENT_TIMESTAMP
        WHERE match_id = ${id}
        RETURNING *
    `;
  return result[0] || null;
}

export async function remove(id) {
  const result = await sql`DELETE FROM tournament_matches WHERE match_id = ${id} RETURNING *`;
  return result[0] || null;
}
