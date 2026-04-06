import { sql } from "../../config/db.js";


export const getSportPositions = async (req, res) => {
    const { sportId } = req.params;

    try {
        const positions = await sql `
            SELECT * FROM sports_position 
            WHERE sport_id = ${sportId}
        `
        console.log("positions: ", positions)
        res.status(200).json({ success: true, data: positions})
    } catch (error) {
        console.log("Error fetching positions: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createSportPosition = async (req, res) => {
    const { sportId, position_name } = req.body;

    if(!sportId || !position_name ){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const position = await sql `
            INSERT INTO sports_position ( sport_id, position_name) 
            VALUES ( ${sportId}, ${position_name})
            RETURNING *
        `
        console.log("New sport position added successfully");
        res.status(201).json({ success: true, data: position[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a sport position: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateSportPosition = async (req, res) => {
    const { id } = req.params;
    const { position_name } = req.body;
    

    try {
        const updatePosition = await sql `
            UPDATE sports_position 
            SET position_name = ${position_name}
            WHERE id = ${id}
            RETURNING *
        `

        if(updatePosition.length === 0){
            return res.status(404).json({ success: false, message: "sport position not found"});
        }

        console.log("sport position updated successfully");
        res.status(200).json({ success: true, data: updatePosition[0]});

    } catch (error) {
        console.log("Error updating an sport position: ", error);
        console.log("BODY:", req.body);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteSportPosition = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteSportPosition = await sql `
            DELETE FROM sports_position WHERE id = ${id}
            RETURNING *
        `

        if(deleteSportPosition.length === 0){
            return res.status(404).json({ success: false, message: "sport position not found"});
        }

        console.log("sport position deleted successfully");
        res.status(200).json({ success: true, data: deleteSportPosition[0]});

    } catch (error) {
        console.log("Error deleting a sport position: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};