import { sql } from "../config/db.js";

export const getMatches = async (req, res) => {
    try {
        const matches = await sql`
            SELECT * FROM matches
            ORDER BY match_date DESC
        `;
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getMatchesById = async (req, res) => {
    const { match_id } = req.params;
    try {
        const matches = await sql`
            SELECT * FROM matches
            WHERE match_id = ${match_id}
            ORDER BY match_date DESC
        `;
        res.status(200).json({ success: true, data: matches[0] });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const getMatchesBySport = async (req, res) => {
    const { sport_id } = req.params;
    try {
        const matches = await sql`
            SELECT * FROM matches
            WHERE sport_id = ${sport_id}
            ORDER BY match_date DESC
        `;
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createMatch = async (req, res) => {
    const { match_id, sport_id, match_name, match_date, start_time, end_time, location, is_team,team_a_id, team_b_id} = req.body;
    try {
        const result = await sql`
            INSERT INTO matches (match_id, sport_id, match_name, match_date, start_time, end_time, location, is_team, team_a_id, team_b_id)
            VALUES (${match_id}, ${sport_id}, ${match_name}, ${match_date}, ${start_time}, ${end_time}, ${location}, ${is_team}, ${team_a_id}, ${team_b_id})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        console.error("Error creating match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateMatch = async (req, res) => {
    const { match_id } = req.params;
    const { match_name, match_date,start_time, end_time, location, is_finished } = req.body;
    try {
        const result = await sql`
            UPDATE matches
            SET match_name = ${match_name},
                match_date = ${match_date},
                start_time = ${start_time},
                end_time = ${end_time},
                location = ${location},
                is_finished = ${is_finished},
                updated_at = CURRENT_TIMESTAMP
            WHERE match_id = ${match_id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: "Match not found" });
        }
        res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        console.error("Error updating match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const deleteMatch = async (req, res) => {
    const { match_id } = req.params;
    try {
        const result = await sql`
            DELETE FROM matches
            WHERE match_id = ${match_id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: "Match not found" });
        }
        res.status(200).json({ success: true, data: result[0] });
    } catch (error) {
        console.error("Error deleting match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};