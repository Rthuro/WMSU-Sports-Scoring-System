import { sql } from "../config/db.js";

export const getTeams = async (req, res) => {
    try {
        const teams = await sql`
            SELECT * FROM teams 
            WHERE is_active = true
            ORDER BY name
        `;
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        console.error("Error fetching teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};


export const getTeamsBySport = async (req, res) => {
    const { sportId } = req.params
    try {
        const teams = await sql`
            SELECT * FROM teams 
            WHERE is_active = true AND sport_id = ${sportId}
            ORDER BY name
        `;
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        console.error("Error fetching teams: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Create a new team
export const createTeam = async (req, res) => {
    const {event_id, department_id, sport_id,  name, short_name, banner_image } = req.body;

    if (!sport_id || !name) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const team = await sql`
            INSERT INTO teams (event_id, department_id, sport_id, name, short_name, banner_image)
            VALUES (${event_id}, ${department_id}, ${sport_id}, ${name}, ${short_name}, ${banner_image})
            RETURNING *
        `;
        res.status(201).json({ success: true, data: team[0] });
    } catch (error) {
        console.error("Error creating a team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Update a team
export const updateTeam = async (req, res) => {
    const { id } = req.params;
    const { department_id, sport_id, name, short_name, banner_image, is_active } = req.body;

    if (!department_id || !name) {
        return res.status(400).json({ success: false, message: "Enter all required fields" });
    }

    try {
        const updated = await sql`
            UPDATE teams
            SET department_id = ${department_id},
                sport_id = ${sport_id},
                name = ${name},
                short_name = ${short_name},
                banner_image = ${banner_image}
                is_active = ${is_active},
            WHERE team_id = ${id}
            RETURNING *
        `;

        if (updated.length === 0) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        res.status(200).json({ success: true, data: updated[0] });
    } catch (error) {
        console.error("Error updating team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

// Delete a team
export const deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await sql`
            DELETE FROM teams WHERE team_id = ${id} RETURNING *
        `;
        if (deleted.length === 0) {
            return res.status(404).json({ success: false, message: "Team not found" });
        }

        res.status(200).json({ success: true, message: "Team deleted successfully" });
    } catch (error) {
        console.error("Error deleting team: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};
               
