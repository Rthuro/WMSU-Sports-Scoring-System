import { sql } from "../config/db.js";

export const getPlayers = async (req, res) => {
    try {
        const players = await sql`
            SELECT * FROM players
        `;
        res.status(200).json({ success: true, data: players });
    } catch (error) {
        console.error("Error fetching players: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getPlayersBySport = async (req, res) => {
    const { sportId } = req.params;
    try {
        const players = await sql`
            SELECT * FROM players WHERE sport_id = ${sportId}
        `;
        res.status(200).json({ success: true, data: players });
    } catch (error) {
        console.error("Error fetching players: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const createPlayer = async (req, res) => {
    const { sport_id, first_name, last_name, middle_initial, gender, student_id, photo } = req.body;

    if (!sport_id || !first_name || !last_name) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const player = await sql`
            INSERT INTO players (sport_id, first_name, last_name, middle_initial, gender, student_id, photo)
            VALUES (${sport_id}, ${first_name}, ${last_name}, ${middle_initial}, ${gender}, ${student_id}, ${photo})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: player[0] });
    } catch (error) {

        console.error("Error creating a player: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updatePlayer = async (req, res) => {
    const { id } = req.params;
    const { sport_id, first_name, last_name, middle_initial, gender, student_id, photo } = req.body;

    if (!sport_id || !first_name || !last_name) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const updated = await sql`
            UPDATE players
            SET sport_id = ${sport_id},
                first_name = ${first_name},
                last_name = ${last_name},
                middle_initial = ${middle_initial},
                gender = ${gender},
                student_id = ${student_id},
                photo = ${photo}
            WHERE player_id = ${id}
            RETURNING *
        `;

        if (updated.length === 0) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }

        res.status(200).json({ success: true, data: updated[0] });
    } catch (error) {
        console.error("Error updating player: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const deletePlayer = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await sql`
            DELETE FROM players WHERE player_id = ${id} RETURNING *
        `;
        if (deleted.length === 0) {
            return res.status(404).json({ success: false, message: "Player not found" });
        }

        res.status(200).json({ success: true, message: "Player deleted successfully" });
    } catch (error) {
        console.error("Error deleting player: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const checkPlayerExists = async (req, res) => {
    const { firstName, lastName } = req.params;
    try {
        const player = await sql`
            SELECT * FROM players WHERE first_name = ${firstName} AND last_name = ${lastName}
        `;
        if (player.length > 0) {
            return res.status(200).json({ success: true, data: player[0] });
        } else {
            return res.status(404).json({ success: false, message: "Player not found" });
        }
    } catch (error) {
        console.error("Error checking if player exists: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}   