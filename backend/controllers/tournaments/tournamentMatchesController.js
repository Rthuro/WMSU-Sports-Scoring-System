import { sql } from "../../config/db.js";

export const getTournamentMatches = async (req, res) => {
    const { tournament_id } = req.params;
    try {
        const tournamentMatches = await sql `
            SELECT * FROM tournament_matches 
            WHERE tournament_id = ${tournament_id}
            ORDER BY date DESC
        `
        res.status(200).json({ success: true, data: tournamentMatches})
    } catch (error) {
        console.log("Error fetching tournament matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}; 

export const getTournamentMatch = async (req, res) => {
    const { match_id } = req.params;
    try {
        const tournamentMatches = await sql `
            SELECT * FROM tournament_matches 
            WHERE match_id = ${match_id}
            ORDER BY date DESC
        `
        res.status(200).json({ success: true, data: tournamentMatches[0]})
    } catch (error) {
        console.log("Error fetching tournament matches: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}; 

export const createTournamentMatch = async (req, res) => {
    const { match_id, sport_id, tournament_id, match_name, date, start_time, end_time, location, round, team_a_id, team_b_id } = req.body;

    if(!match_id || !tournament_id || !match_name || !round ){  
        toast.error("Please fill in all required fields");
        return res.status(400).json({ success:false, message: "Enter all required fields"});
    }

    try {
        const match = await sql `
            INSERT INTO tournament_matches ( match_id,sport_id, tournament_id, match_name, date, start_time, end_time, location, team_a_id, team_b_id, round) 
            VALUES ( ${match_id}, ${sport_id}, ${tournament_id}, ${match_name}, ${date}, ${start_time}, ${end_time}, ${location}, ${team_a_id}, ${team_b_id}, ${round} )
            RETURNING *
        `
        console.log("match created: ", match);
        res.status(201).json({ success: true, data: match[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error"})
    }

};

export const updateTournamentMatch = async (req, res) => {
    const { id } = req.params;
    const { match_name, date,start_time, end_time, location, round, is_finished } = req.body;
    
    try {
        const updateTournamentMatch = await sql `
            UPDATE tournament_matches 
            SET match_name = COALESCE(${match_name}, match_name),
                date = COALESCE(${date}, date),
                start_time = COALESCE(${start_time}, start_time),
                end_time = COALESCE(${end_time}, end_time),
                location = COALESCE(${location}, location),
                round = COALESCE(${round}, round),
                is_finished = COALESCE(${is_finished}, is_finished),
                updated_at = CURRENT_TIMESTAMP
            WHERE match_id = ${id}
            RETURNING *
        `

        if(updateTournamentMatch.length === 0){
            return res.status(404).json({ success: false, message: "tournament match not found"});
        }

        res.status(200).json({ success: true, data: updateTournamentMatch[0]});

    } catch (error) {
        console.log("Error updating a tournament match: ", error);
        console.log("BODY:", req.body);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteTournamentMatch = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTournamentMatch = await sql `
            DELETE FROM tournament_matches 
            WHERE match_id = ${id}
            RETURNING *
        `

        if(deletedTournamentMatch.length === 0){
            return res.status(404).json({ success: false, message: "tournament match not found"});
        }

        res.status(200).json({ success: true, data: deletedTournamentMatch[0]});

    } catch (error) {
        console.log("Error deleting a tournament match: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};
