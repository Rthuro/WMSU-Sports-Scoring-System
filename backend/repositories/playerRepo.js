import { sql } from "../config/db.js";

export async function findAll() {
  return await sql`SELECT * FROM players WHERE is_deleted = false`;
}


export async function findById(id) {
  const result = await sql`SELECT * FROM players WHERE player_id = ${id} AND is_deleted = false`;
  return result[0] || null;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM players WHERE sport_id = ${sportId} AND is_deleted = false`;
}

export async function findByName(firstName, lastName) {
  const result = await sql`SELECT * FROM players WHERE first_name = ${firstName} AND last_name = ${lastName} AND is_deleted = false`;
  return result[0] || null;
}

export async function findProfileById(playerId) {
  const [player] = await sql`
    SELECT 
      p.*, 
      s.name AS sport_name
    FROM players p
    LEFT JOIN sports s ON p.sport_id = s.sport_id
    WHERE p.player_id = ${playerId}
  `;

  if (!player) return null;

  const teams = await sql`
    SELECT t.*, pt.position_id, pt.jersey_number, e.name AS event_name, d.name AS department_name
    FROM player_teams pt
    JOIN teams t ON pt.team_id = t.team_id
    LEFT JOIN events e ON t.event_id = e.event_id
    LEFT JOIN departments d ON t.department_id = d.department_id
    WHERE pt.player_id = ${playerId} AND t.is_deleted = false
  `;

  const tournaments = await sql`
    SELECT tr.*, tt.wins, tt.losses, e.name AS event_name, t.name AS team_name, s.name AS sport_name
    FROM tournament_tally tt
    JOIN tournaments tr ON tt.tournament_id = tr.tournament_id
    LEFT JOIN events e ON tr.event_id = e.event_id
    LEFT JOIN sports s ON tr.sport_id = s.sport_id
    LEFT JOIN teams t ON tt.team_id = t.team_id
    LEFT JOIN player_teams pt ON pt.team_id = t.team_id AND pt.player_id = ${playerId}
    WHERE pt.player_id = ${playerId}
  `;

  const matchParticipations = await sql`
    SELECT 
      mp.*,
      m.match_name,
      m.date,
      m.is_finished,
      m.winner_id,
      s.name AS sport_name,
      t.name AS team_name,
      CASE 
        WHEN mp.team_id IS NOT NULL THEN 
          CASE WHEN mp.team_id = m.team_a_id THEN tb.name ELSE ta.name END
        ELSE NULL
      END AS opponent_name,
      CASE WHEN mp.is_winner = true THEN 'Win' WHEN m.winner_id IS NOT NULL THEN 'Loss' ELSE 'Pending' END AS result
    FROM match_participants mp
    JOIN matches m ON mp.match_id = m.match_id
    JOIN sports s ON m.sport_id = s.sport_id
    LEFT JOIN teams t ON mp.team_id = t.team_id
    LEFT JOIN teams ta ON m.team_a_id = ta.team_id
    LEFT JOIN teams tb ON m.team_b_id = tb.team_id
    WHERE mp.player_id = ${playerId}
    ORDER BY m.date DESC
  `;

  return {
    ...player,
    teams,
    tournaments,
    matchParticipations
  };
}

export async function create(data) {
  const result = await sql`
    INSERT INTO players (sport_id, first_name, last_name, middle_initial, gender, student_id, photo)
    VALUES (${data.sport_id}, ${data.first_name}, ${data.last_name}, ${data.middle_initial}, ${data.gender}, ${data.student_id}, ${data.photo})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE players
    SET sport_id = ${data.sport_id}, first_name = ${data.first_name}, last_name = ${data.last_name},
        middle_initial = ${data.middle_initial}, gender = ${data.gender},
        student_id = ${data.student_id}, photo = ${data.photo}
    WHERE player_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE players SET is_deleted = true WHERE player_id = ${id} RETURNING *
  `;
  return result[0] || null;
}

export async function findByDepartment(departmentId){
  return await sql`
  SELECT p.*, t.name AS team_name, pt.position_id, pt.jersey_number, pt.team_id
  FROM players p
  JOIN player_teams pt ON pt.player_id = p.player_id
  JOIN teams t ON t.team_id = pt.team_id
  WHERE t.department_id = ${departmentId} 
    AND p.is_deleted = false 
    AND t.is_deleted = false`;
}

export async function findByTeam(teamId){
  return await sql`
  SELECT p.*, pt.id as player_team_id, pt.position_id, pt.jersey_number, pt.team_id 
  FROM players p
  JOIN player_teams pt ON pt.player_id = p.player_id
  WHERE pt.team_id = ${teamId} 
    AND p.is_deleted = false`;
}
