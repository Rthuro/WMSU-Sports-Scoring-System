import { sql } from "../config/db.js";

// status: 200(ok), 201(created), 400(invalid req), 500(server crashed), 404(not found)

export const getSports = async (req, res) => {
    try {
        const sports = await sql `
            SELECT * FROM sports 
            ORDER BY created_at DESC
        `
        res.status(200).json({ success: true, data: sports})
    } catch (error) {
        console.log("Error fetching sports: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const getSportById = async (req, res) => {
    const { id } = req.params;
    try {
        const sport = await sql `
            SELECT * FROM sports WHERE sport_id = ${id}
        `;
        if(sport.length === 0){
            return res.status(404).json({ success: false, message: "Sport not found" });
        }
        res.status(200).json({ success: true, data: sport[0] });
    } catch (error) {
        console.log("Error fetching sport by ID: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const createSport = async (req, res) => {
    const { name, iconPath, scoringType, defaultSets, maxSets, maxScore, timePerSet, minPlayers, maxPlayers, useSetBasedScoring, hasPenaltyAffectsScore, hasSetLineUp } = req.body;

    if(!name || !scoringType || !defaultSets || !maxSets || !minPlayers || !maxPlayers ){
        return res.status(400).json({ success:false, message: "Enter all required fields"});
    }

    try {
        const sport = await sql `
            INSERT INTO sports ( name, icon_path, scoring_type, default_sets, max_sets, max_score, timePerSet, min_players, max_players, use_set_based_scoring, has_penalty_affects_score, has_set_lineup) 
            VALUES ( ${name}, ${iconPath}, ${scoringType}, ${defaultSets}, ${maxSets}, ${maxScore}, ${timePerSet}, ${minPlayers}, ${maxPlayers}, ${useSetBasedScoring}, ${hasPenaltyAffectsScore}, ${hasSetLineUp})
            RETURNING *
        `
        console.log("New sport added successfully");
        res.status(201).json({ success: true, data: sport[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a sport: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateSport = async (req, res) => {
    const { id } = req.params;
    const { name, iconPath, scoringType, defaultSets, maxSets, maxScore, timePerSet, minPlayers, maxPlayers, useSetBasedScoring, hasPenaltyAffectsScore, hasSetLineUp } = req.body;
    

    try {
        const updateSport = await sql `
            UPDATE sports 
            SET name=${name}, icon_path=${iconPath}, 
            scoring_type=${scoringType}, default_sets=${defaultSets}, max_sets=${maxSets}, 
            max_score=${maxScore}, timePerSet=${timePerSet}, min_players=${minPlayers}, max_players=${maxPlayers}, use_set_based_scoring=${useSetBasedScoring}, has_penalty_affects_score=${hasPenaltyAffectsScore}, has_set_lineup=${hasSetLineUp}, updated_at=CURRENT_TIMESTAMP 
            WHERE sport_id = ${id}
            RETURNING *
        `

        if(updateSport.length === 0){
            return res.status(404).json({ success: false, message: "sport not found"});
        }

        console.log("sport updated successfully");
        res.status(200).json({ success: true, data: updateSport[0]});

    } catch (error) {
        console.log("Error updating an sport: ", error);
        console.log("BODY:", req.body);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteSport = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteSport = await sql `
            DELETE FROM sports WHERE sport_id = ${id}
            RETURNING *
        `

        if(deleteSport.length === 0){
            return res.status(404).json({ success: false, message: "sport not found"});
        }

        console.log("sport deleted successfully");
        res.status(200).json({ success: true, data: deleteSport[0]});

    } catch (error) {
        console.log("Error deleting an sport: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const checkSportExists = async (req, res) => {
    const { name } = req.params;

    try {
        const sport = await sql `
            SELECT * FROM sports WHERE name = ${name}
        `;

        if(sport.length > 0){
            return res.status(200).json({ success: true, data: sport[0] });
        } else {
            return res.status(200).json({ success: false });
        }

    } catch (error) {
        console.log("Error checking if sport exists: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

