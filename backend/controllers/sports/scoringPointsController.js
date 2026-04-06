import { sql } from "../../config/db.js";

// status: 200(ok), 201(created), 400(invalid req), 500(server crashed), 404(not found)

export const getSportScoringPoints = async (req, res) => {
    const { sportId } = req.params;

    try {
        const scoring_points = await sql `
            SELECT * FROM scoring_points 
            WHERE sport_id = ${sportId}
        `
        console.log("scoring_points: ", scoring_points)
        res.status(200).json({ success: true, data: scoring_points})
    } catch (error) {
        console.log("Error fetching scoring_points: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createSportScoringPoints = async (req, res) => {
    const { sportId, point } = req.body;

    if(!sportId || !point ){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const scoring_points = await sql `
            INSERT INTO scoring_points ( sport_id, point) 
            VALUES ( ${sportId}, ${point})
            RETURNING *
        `
        console.log("New scoring_points added successfully");
        res.status(201).json({ success: true, data: scoring_points[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a scoring_points: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateSportScoringPoints = async (req, res) => {
    const { id } = req.params;
    const { point } = req.body;
    

    try {
        const updateScoringPoint = await sql `
            UPDATE scoring_points 
            SET point=${point}
            WHERE scoring_point_id = ${id}
            RETURNING *
        `

        if(updateScoringPoint.length === 0){
            return res.status(404).json({ success: false, message: "scoring point not found"});
        }

        console.log("scoring point updated successfully");
        res.status(200).json({ success: true, data: updateScoringPoint[0]});

    } catch (error) {
        console.log("Error updating an scoring point: ", error);
        console.log("BODY:", req.body);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteSportScoringPoints = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteScoringPoint = await sql `
            DELETE FROM scoring_points WHERE scoring_point_id = ${id}
            RETURNING *
        `

        if(deleteScoringPoint.length === 0){
            return res.status(404).json({ success: false, message: "scoring point not found"});
        }

        console.log("scoring point deleted successfully");
        res.status(200).json({ success: true, data: deleteScoringPoint[0]});

    } catch (error) {
        console.log("Error deleting a scoring point: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};