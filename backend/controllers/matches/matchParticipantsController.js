import { sql } from "../../config/db.js";

export const getMatchParticipants = async (req, res) => {
    try {
        const participants = await sql`
            SELECT * FROM match_participants
        `;
        res.status(200).json({ success: true, data: participants });
    } catch (error) {
        console.error("Error fetching matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createMatchParticipants = async (req, res) => {
    const { match_id, team_id, player_id} = req.body;
    try {
        const result = await sql`
            INSERT INTO match_participants (match_id, team_id, player_id)
            VALUES (${match_id}, ${team_id}, ${player_id})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: result[0] });
    } catch (error) {
        console.error("Error creating match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

