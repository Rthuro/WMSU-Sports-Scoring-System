import { sql } from "../../config/db.js";

export const getTournamentTeams = async (req, res) => {
    const { tournament_id } = req.params;
    try {
        const tournamentTeams = await sql `
            SELECT * FROM tournament_teams 
            WHERE tournament_id = ${tournament_id}
            ORDER BY tournament_team_id DESC
        `
        res.status(200).json({ success: true, data: tournamentTeams})
    } catch (error) {
        console.log("Error fetching tournament teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createTournamentTeam = async (req, res) => {
    const { tournament_id, team_id } = req.body;

    if (!tournament_id || !team_id) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const team = await sql`
            INSERT INTO tournament_teams (tournament_id, team_id)
            VALUES (${tournament_id}, ${team_id})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: team[0] });
    } catch (error) {
        console.log("Error creating a tournament team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateTournamentTeam = async (req, res) => {
    const { id } = req.params;
    const { tournament_id, team_id } = req.body;

    try {
        const updatedTournamentTeam = await sql`
            UPDATE tournament_teams
            SET tournament_id = ${tournament_id}, team_id = ${team_id}, updated_at = CURRENT_TIMESTAMP
            WHERE tournament_team_id = ${id}
            RETURNING *
        `;

        if (updatedTournamentTeam.length === 0) {
            return res.status(404).json({ success: false, message: "Tournament team not found" });
        }

        res.status(200).json({ success: true, data: updatedTournamentTeam[0] });
    } catch (error) {
        console.log("Error updating a tournament team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const deleteTournamentTeam = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTournamentTeam = await sql`
            DELETE FROM tournament_teams 
            WHERE tournament_team_id = ${id}
            RETURNING *
        `;

        if (deletedTournamentTeam.length === 0) {
            return res.status(404).json({ success: false, message: "Tournament team not found" });
        }

        res.status(200).json({ success: true, data: deletedTournamentTeam[0] });

    } catch (error) {
        console.log("Error deleting a tournament team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
