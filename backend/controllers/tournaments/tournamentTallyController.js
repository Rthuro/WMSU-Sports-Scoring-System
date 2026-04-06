import { sql } from "../../config/db.js";

export const getTournamentTally = async (req, res) => {
    try {
        const tally = await sql`
            SELECT * FROM tournament_tally
        `;
        res.status(200).json({ success: true, data: tally });
    } catch (error) {
        console.log("Error fetching tally: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createTournamentTally = async (req, res) => {
    const { tournament_id, team_id, wins = 0, losses = 0 } = req.body;
    try {
        const [newTally] = await sql`
            INSERT INTO tournament_tally (tournament_id, team_id, wins, losses)
            VALUES ( ${tournament_id}, ${team_id}, ${wins}, ${losses})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: newTally });
    } catch (error) {
        console.log("Error creating tally: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateTournamentTally = async (req, res) => {
    const { tournament_id , team_id} = req.params;
    const { wins, losses } = req.body;
    try {
        const [updatedTally] = await sql`
            UPDATE tournament_tally
            SET
                wins = COALESCE(${wins}, wins),
                losses = COALESCE(${losses}, losses)
            WHERE tournament_id = ${tournament_id} AND team_id = ${team_id}
            RETURNING *
        `;
        if (!updatedTally) {
            return res.status(404).json({ success: false, error: "Tally not found" });
        }
        res.status(200).json({ success: true, data: updatedTally });
    } catch (error) {
        console.log("Error updating tally: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const deleteTournamentTally = async (req, res) => {
    const { tally_id } = req.params;
    try {
        const result = await sql`
            DELETE FROM tournament_tally
            WHERE tally_id = ${tally_id}
            RETURNING *
        `;
        if (result.length === 0) {
            return res.status(404).json({ success: false, error: "Tally not found" });
        }
        console.log("Deleted tally: ", result[0]);
        res.status(200).json({ success: true, message: "Tally deleted successfully" });
    } catch (error) {
        console.log("Error deleting tally: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};