import { sql } from "../../config/db.js";


export const getSportPenalties = async (req, res) => {
    const { sportId } = req.params;

    try {
        const penalties = await sql `
            SELECT * FROM penalty_types 
            WHERE sport_id = ${sportId}
        `
        res.status(200).json({ success: true, data: penalties})
    } catch (error) {
        console.log("Error fetching sport penalties: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createPenalty = async (req, res) => {
    const { sportId, penalty_name, description, penalty_point, affects_score, penalty_limit } = req.body;

    if(!sportId || !penalty_name || !penalty_point){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const penalty = await sql `
            INSERT INTO penalty_types ( sport_id, penalty_name, description, penalty_point, affects_score, penalty_limit) 
            VALUES ( ${sportId}, ${penalty_name}, ${description}, ${penalty_point}, ${affects_score}, ${penalty_limit})
            RETURNING *
        `
        console.log("New sport penalty added successfully");
        res.status(201).json({ success: true, data: penalty[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a penalty: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updatePenalty = async (req, res) => {
    const { id } = req.params;
    const { penalty_name, description, penalty_point, affects_score, penalty_limit } = req.body;
    
    try {
        const updatePenalty = await sql `
            UPDATE penalty_types 
            SET penalty_name = ${penalty_name}, 
                description = ${description}, 
                penalty_point = ${penalty_point}, 
                affects_score = ${affects_score}, 
                penalty_limit = ${penalty_limit}
            WHERE penalty_id = ${id}
            RETURNING *
        `

        if(updatePenalty.length === 0){
            return res.status(404).json({ success: false, message: "penalty not found"});
        }

        console.log("penalty updated successfully");
        res.status(200).json({ success: true, data: updatePenalty[0]});

    } catch (error) {
        console.log("Error updating an penalty: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deletePenalty = async (req, res) => {
    const { id } = req.params;

    try {
        const deletePenalty = await sql `
            DELETE FROM penalty_types WHERE penalty_id = ${id}
            RETURNING *
        `

        if(deletePenalty.length === 0){
            return res.status(404).json({ success: false, message: "penalty not found"});
        }

        console.log("penalty deleted successfully");
        res.status(200).json({ success: true, data: deletePenalty[0]});

    } catch (error) {
        console.log("Error deleting a penalty: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};