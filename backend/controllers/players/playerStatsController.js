import { sql } from "../../config/db.js";

export const getPlayerStats = async (req, res) => {
    try {
        const playerStats = await sql`
            SELECT * FROM player_stats
        `;
        res.status(200).json({ success: true, data: playerStats });
    } catch (error) {
        console.error("Error fetching player teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getPlayerStatsByMatch = async (req, res) => {
    const { match_id } = req.params;
    try {
        const playerStats = await sql`
            SELECT * FROM player_stats
            WHERE match_id = ${match_id}
        `;
        res.status(200).json({ success: true, data: playerStats });
    } catch (error) {
        console.error("Error fetching player teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

