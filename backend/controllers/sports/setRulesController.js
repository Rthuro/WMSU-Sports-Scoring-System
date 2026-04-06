import { sql } from "../../config/db.js";


export const getSetRules = async (req, res) => {
    const { sportId } = req.params;

    try {
        const setRules = await sql `
            SELECT * FROM set_rules 
            WHERE sport_id = ${sportId}
        `
        console.log("set rules: ", setRules)
        res.status(200).json({ success: true, data: setRules})
    } catch (error) {
        console.log("Error fetching set rules: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createSetRule = async (req, res) => {
    const { sportId, set_number, max_score, time_limit } = req.body;

    if(!sportId || !set_number){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const setRule = await sql `
            INSERT INTO set_rules ( sport_id, set_number, max_score, time_limit) 
            VALUES ( ${sportId}, ${set_number}, ${max_score}, ${time_limit})
            RETURNING *
        `
        console.log("New set rule added successfully");
        res.status(201).json({ success: true, data: setRule[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a set rule: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateSetRule = async (req, res) => {
    const { id } = req.params;
     const { set_number, max_score, time_limit } = req.body;
    
    try {
        const updateSetRule = await sql `
            UPDATE set_rules 
            SET set_number = ${set_number}, 
                max_score = ${max_score}, 
                time_limit = ${time_limit}
            WHERE set_rule_id = ${id}
            RETURNING *
        `

        if(updateSetRule.length === 0){
            return res.status(404).json({ success: false, message: "set rule not found"});
        }

        console.log("set rule updated successfully");
        res.status(200).json({ success: true, data: updateSetRule[0]});

    } catch (error) {
        console.log("Error updating an set rule: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteSetRule = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteSetRule = await sql `
            DELETE FROM set_rules WHERE set_rule_id = ${id}
            RETURNING *
        `

        if(deleteSetRule.length === 0){
            return res.status(404).json({ success: false, message: "set rule not found"});
        }

        console.log("set rule deleted successfully");
        res.status(200).json({ success: true, data: deleteSetRule[0]});

    } catch (error) {
        console.log("Error deleting a set rule: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};