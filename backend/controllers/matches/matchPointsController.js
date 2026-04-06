import { sql } from "../../config/db.js";

export const getMatchesPoints = async (req, res) => {
    try {
        const matches = await sql`
            SELECT * FROM match_points
            ORDER BY set_number DESC
        `;
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getMatchPointsByMatchId = async (req, res) => {
    const { match_id } = req.params;
    try {
        const matchPoints = await sql`
            SELECT * FROM match_points WHERE match_id = ${match_id}
            ORDER BY set_number DESC, time DESC
        `;
        res.status(200).json({ success: true, data: matchPoints });
    } catch (error) {
        console.error("Error fetching match points: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createMatchPoints = async (req, res) => {
    try {
        const { match_id,  team_a_id, team_b_id, player_a_id, player_b_id, set_number, a_score, b_score, time } = req.body;

        const newMatchPoint = await sql`
            INSERT INTO match_points (match_id, team_a_id, team_b_id, player_a_id, player_b_id, a_score, b_score, set_number, time)
            VALUES (${match_id}, ${team_a_id}, ${team_b_id}, ${player_a_id}, ${player_b_id}, ${a_score}, ${b_score}, ${set_number}, ${time})
            RETURNING *
        `;
        res.status(200).json({ success: true, data: newMatchPoint[0] });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateMatchPoints = async (req, res) => {
    try {
        const { entry_id, match_id, team_a_id, team_b_id, player_a_id, player_b_id,  a_score, b_score,set_number, time } = req.body;

        const updatedMatchPoint = await sql`
            UPDATE match_points
            SET match_id = ${match_id}, team_a_id = ${team_a_id}, team_b_id = ${team_b_id}, player_a_id = ${player_a_id}, player_b_id = ${player_b_id}, a_score = ${a_score}, b_score = ${b_score}, set_number = ${set_number}, time = ${time}
            WHERE entry_id = ${entry_id}
            RETURNING *
        `;
        res.status(200).json({ success: true, data: updatedMatchPoint[0] });
    } catch (error) {
        console.error("Error updating match points: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}

