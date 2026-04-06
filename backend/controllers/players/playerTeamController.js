import { sql } from "../../config/db.js";

export const getPlayerTeams = async (req, res) => {
    try {
        const playerTeams = await sql`
            SELECT * FROM player_teams
        `;
        res.status(200).json({ success: true, data: playerTeams });
    } catch (error) {
        console.error("Error fetching player teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const getPlayerTeamsByTeam = async (req, res) => {
    const { teamId } = req.params;
    try {
        const playerTeams = await sql`
            SELECT * FROM player_teams WHERE team_id = ${teamId}
        `;
        res.status(200).json({ success: true, data: playerTeams });
    } catch (error) {
        console.error("Error fetching player teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createPlayerTeam = async (req, res) => {
    const { player_id, team_id, position_id, jersey_number } = req.body;

    if (!player_id || !team_id) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const playerTeam = await sql`
            INSERT INTO player_teams (player_id, team_id, position_id, jersey_number)
            VALUES (${player_id}, ${team_id}, ${position_id}, ${jersey_number})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: playerTeam[0] });
    } catch (error) {
        console.error("Error creating a player team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updatePlayerTeam = async (req, res) => {
    const { id } = req.params;
    const { player_id, team_id, position_id, jersey_number } = req.body;

    if (!player_id || !team_id) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const updated = await sql`
            UPDATE player_teams
            SET player_id = ${player_id},
                team_id = ${team_id},
                position_id = ${position_id},
                jersey_number = ${jersey_number}
            WHERE id = ${id}
            RETURNING *
        `;

        if (updated.length === 0) {
            return res.status(404).json({ success: false, message: "Player team not found" });
        }

        res.status(200).json({ success: true, data: updated[0] });
    } catch (error) {
        console.error("Error updating player team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const deletePlayerTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await sql`
            DELETE FROM player_teams WHERE id = ${id} RETURNING *
        `;
        if (deleted.length === 0) {
            return res.status(404).json({ success: false, message: "Player team not found" });
        }

        res.status(200).json({ success: true, message: "Player team deleted successfully" });
    } catch (error) {
        console.error("Error deleting player team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const checkPlayerTeamExists = async (req, res) => {
    const { playerId, teamId } = req.params;
    try {
        const playerTeam = await sql`
            SELECT * FROM player_teams WHERE player_id = ${playerId} AND team_id = ${teamId}
        `;
        if (playerTeam.length > 0) {
            return res.status(200).json({ success: true, data: playerTeam[0] });
        } else {
            return res.status(404).json({ success: false, message: "Player team not found" });
        }
    } catch (error) {
        console.error("Error checking if player team exists: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
