import { sql } from "../../config/db.js";

export async function findByDateRange(startDate, endDate) {
  const matches = await sql`
  SELECT m.*,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo,
    sports.name AS sport_name
  FROM matches m
  LEFT JOIN teams team_a ON m.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON m.team_b_id = team_b.team_id
  LEFT JOIN sports ON m.sport_id = sports.sport_id
  WHERE m.date >= ${startDate} AND m.date <= ${endDate} AND m.is_deleted = false
  ORDER BY m.date ASC, m.start_time ASC`;

  const tournaments = await sql`
  SELECT 
    t.*,
    s.name AS sport_name,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo
  FROM tournament_matches t
  LEFT JOIN teams team_a ON t.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON t.team_b_id = team_b.team_id
  LEFT JOIN sports s ON t.sport_id = s.sport_id
  WHERE t.date >= ${startDate} AND t.date <= ${endDate} AND t.is_deleted = false
   ORDER BY t.date ASC, t.start_time ASC`;

  return {
    matches,
    tournaments
  };
}

export async function findMatchWithPoints() {
  const matches = await sql`
  SELECT 
    m.*,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo,
    sports.name AS sport_name,
    COALESCE(SUM(mp.a_score), 0) AS total_a_score,
    COALESCE(SUM(mp.b_score), 0) AS total_b_score
  FROM matches m
  LEFT JOIN teams team_a ON m.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON m.team_b_id = team_b.team_id
  LEFT JOIN sports ON m.sport_id = sports.sport_id
  LEFT JOIN match_points mp ON m.match_id = mp.match_id
  WHERE m.is_deleted = false
  GROUP BY m.match_id, team_a.name, team_a.banner_image, team_b.name, team_b.banner_image, sports.name
  ORDER BY m.date DESC, m.start_time DESC`;

  const tournamentMatches = await sql`
  SELECT 
    t.*,
    team_a.name AS team_a,
    team_a.banner_image AS team_a_logo,
    team_b.name AS team_b,
    team_b.banner_image AS team_b_logo,
    sports.name AS sport_name,
    COALESCE(SUM(mp.a_score), 0) AS total_a_score,
    COALESCE(SUM(mp.b_score), 0) AS total_b_score
  FROM tournament_matches t
  LEFT JOIN teams team_a ON t.team_a_id = team_a.team_id
  LEFT JOIN teams team_b ON t.team_b_id = team_b.team_id
  LEFT JOIN sports ON t.sport_id = sports.sport_id
  LEFT JOIN match_points mp ON t.match_id = mp.match_id
  WHERE t.is_deleted = false
  GROUP BY t.match_id, team_a.name, team_a.banner_image, team_b.name, team_b.banner_image, sports.name
  ORDER BY t.date DESC, t.start_time DESC`;

  return {
    matches: matches,
    tournaments: tournamentMatches
  };
}

export async function findAllEvents() {
  return await sql`
    SELECT 
      e.*,
      (SELECT COUNT(*) FROM tournaments t WHERE t.event_id = e.event_id AND t.is_deleted = false) AS tournament_count
    FROM events e
    WHERE e.is_deleted = false
    ORDER BY e.start_date DESC
  `;
}

export async function findTournamentsWithTally() {
  const tournaments = await sql`
    SELECT 
      t.*,
      s.name AS sport_name,
      e.name AS event_name,
      e.banner_image AS event_banner
    FROM tournaments t
    LEFT JOIN sports s ON t.sport_id = s.sport_id
    LEFT JOIN events e ON t.event_id = e.event_id
    WHERE t.is_deleted = false
    ORDER BY t.start_date DESC
  `;

  const tally = await sql`
    SELECT 
      tt.*,
      tm.name AS team_name,
      tm.banner_image AS team_logo,
      d.name AS department_name
    FROM tournament_tally tt
    JOIN teams tm ON tt.team_id = tm.team_id
    LEFT JOIN departments d ON tm.department_id = d.department_id
    ORDER BY tt.wins DESC, tt.losses ASC
  `;

  return { tournaments, tally };
}
