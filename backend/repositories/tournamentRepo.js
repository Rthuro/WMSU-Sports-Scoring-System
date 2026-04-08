import { sql } from "../config/db.js";
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`;

/**
 * Creates a tournament with teams, tally entries, and bracket matches — all in one transaction.
 * Match generation logic (previously on the frontend) is now handled server-side.
 */
export async function createWithTeamsAndMatches(data) {
  const txSql = neon(connectionString, { fullResults: false });
  await txSql("BEGIN");

  try {
    // 1. Insert the tournament
    const [tournament] = await txSql(
      `INSERT INTO tournaments (tournament_id, event_id, sport_id, name, description, start_date, end_date, location, banner_image, bracketing)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [data.tournament_id, data.event_id || null, data.sport_id, data.name, data.description || null, data.start_date, data.end_date, data.location || null, data.banner_image || null, data.bracketing]
    );

    const teamIds = data.teams || [];

    // 2. Enroll teams in tournament + create tally entries
    for (const teamId of teamIds) {
      await txSql(
        `INSERT INTO tournament_teams (tournament_id, team_id) VALUES ($1, $2)`,
        [data.tournament_id, teamId]
      );
      await txSql(
        `INSERT INTO tournament_tally (tournament_id, team_id, wins, losses) VALUES ($1, $2, 0, 0)`,
        [data.tournament_id, teamId]
      );
    }

    // 3. Generate bracket matches based on bracketing type
    if (teamIds.length >= 2) {
      // Fetch team names for match naming
      const allTeams = await txSql(`SELECT team_id, name FROM teams WHERE team_id = ANY($1)`, [teamIds]);
      const teamMap = {};
      for (const t of allTeams) {
        teamMap[t.team_id] = t.name;
      }
      const getTeamName = (id) => teamMap[id] || "TBD";

      if (data.bracketing === "round-robin") {
        let matchCounter = 1;
        for (let i = 0; i < teamIds.length; i++) {
          for (let j = i + 1; j < teamIds.length; j++) {
            const matchId = `${data.tournament_id}_RR_M${matchCounter++}`;
            const matchName = `${getTeamName(teamIds[i])} vs ${getTeamName(teamIds[j])}`;
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, teamIds[i], teamIds[j], 1]
            );
          }
        }
      } else if (data.bracketing === "single-elimination") {
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        let size = 2;
        while (size < shuffled.length) size *= 2;
        while (shuffled.length < size) shuffled.push(null); // pad with BYES
        
        let round = 1;
        let matchesInRound = size / 2;
        while (matchesInRound >= 1) {
          for (let i = 0; i < matchesInRound; i++) {
            const matchId = `${data.tournament_id}_SE_R${round}_M${i+1}`;
            let team1 = null, team2 = null, matchName = "";
            if (round === 1) {
              team1 = shuffled[i * 2];
              team2 = shuffled[i * 2 + 1];
              matchName = `R${round} M${i+1} (${team1 ? getTeamName(team1) : 'BYE'} vs ${team2 ? getTeamName(team2) : 'BYE'})`;
            } else {
              matchName = `R${round} M${i+1}`;
            }
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, team1, team2, round]
            );
          }
          round++;
          matchesInRound /= 2;
        }
      } else if (data.bracketing === "double-elimination") {
        const shuffled = [...teamIds].sort(() => Math.random() - 0.5);
        let size = 2;
        while (size < shuffled.length) size *= 2;
        while (shuffled.length < size) shuffled.push(null); // pad with BYES

        // Upper Bracket
        let ubRound = 1;
        let ubMatchesInRound = size / 2;
        while (ubMatchesInRound >= 1) {
          for (let i = 0; i < ubMatchesInRound; i++) {
            const matchId = `${data.tournament_id}_DE_UB_R${ubRound}_M${i+1}`;
            let team1 = null, team2 = null, matchName = "";
            if (ubRound === 1) {
              team1 = shuffled[i * 2];
              team2 = shuffled[i * 2 + 1];
              matchName = `UB R${ubRound} M${i+1} (${team1 ? getTeamName(team1) : 'BYE'} vs ${team2 ? getTeamName(team2) : 'BYE'})`;
            } else {
              matchName = `UB R${ubRound} M${i+1}`;
            }
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, team1, team2, ubRound]
            );
          }
          ubRound++;
          ubMatchesInRound /= 2;
        }

        // Lower Bracket
        let lbRounds = (Math.log2(size) - 1) * 2; 
        let lbMatchesInRound = size / 4;
        let currentLbRound = 1;
        while (currentLbRound <= lbRounds) {
          for (let i = 0; i < lbMatchesInRound; i++) {
            const matchId = `${data.tournament_id}_DE_LB_R${currentLbRound}_M${i+1}`;
            const matchName = `LB R${currentLbRound} M${i+1}`;
            await txSql(
              `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
               VALUES ($1, $2, $3, $4, $5, $6, $7)`,
              [matchId, data.sport_id, data.tournament_id, matchName, null, null, currentLbRound]
            );
          }
          currentLbRound++;
          if (currentLbRound % 2 !== 0) lbMatchesInRound /= 2;
        }

        // Grand Final
        const grandFinalId = `${data.tournament_id}_DE_FINAL`;
        await txSql(
          `INSERT INTO tournament_matches (match_id, sport_id, tournament_id, match_name, team_a_id, team_b_id, round)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [grandFinalId, data.sport_id, data.tournament_id, "Grand Final", null, null, 99]
        );
      }
    }

    await txSql("COMMIT");
    return tournament;

  } catch (error) {
    await txSql("ROLLBACK");
    throw error;
  }
}

export async function findAll() {
  return await sql`SELECT * FROM tournaments WHERE is_deleted = false ORDER BY start_date DESC`;
}

export async function findById(id) {
  const result = await sql`SELECT * FROM tournaments WHERE tournament_id = ${id} AND is_deleted = false`;
  return result[0] || null;
}

export async function findBySport(sportId) {
  return await sql`SELECT * FROM tournaments WHERE sport_id = ${sportId} AND is_deleted = false ORDER BY start_date DESC`;
}

export async function findByEvent(eventId) {
  return await sql`SELECT * FROM tournaments WHERE event_id = ${eventId} AND is_deleted = false`;
}

export async function create(data) {
  const result = await sql`
    INSERT INTO tournaments (tournament_id, event_id, sport_id, name, description, start_date, end_date, location, banner_image, bracketing)
    VALUES (${data.tournament_id}, ${data.event_id}, ${data.sport_id}, ${data.name}, ${data.description}, ${data.start_date}, ${data.end_date}, ${data.location}, ${data.banner_image}, ${data.bracketing})
    RETURNING *
  `;
  return result[0];
}

export async function update(id, data) {
  const result = await sql`
    UPDATE tournaments
    SET event_id=${data.event_id}, sport_id=${data.sport_id}, name=${data.name}, description=${data.description},
    start_date=${data.start_date}, end_date=${data.end_date}, location=${data.location}, banner_image=${data.banner_image}, updated_at=CURRENT_TIMESTAMP
    WHERE tournament_id = ${id} AND is_deleted = false
    RETURNING *
  `;
  return result[0] || null;
}

export async function softDelete(id) {
  const result = await sql`
    UPDATE tournaments SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
    WHERE tournament_id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}
