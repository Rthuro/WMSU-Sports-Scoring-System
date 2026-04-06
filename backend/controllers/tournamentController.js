import { sql } from "../config/db.js";

export const getTournaments = async (req, res) => {
    try {
        const tournaments = await sql `
            SELECT * FROM tournaments 
            ORDER BY start_date DESC
        `
        res.status(200).json({ success: true, data: tournaments})
    } catch (error) {
        console.log("Error fetching tournaments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}; 

export const getTournamentById= async (req, res) => {
    const { id } = req.params;
    try {
        const tournament = await sql `
            SELECT * FROM tournaments 
            WHERE tournament_id = ${id}
            ORDER BY start_date DESC
        `
        // console.log("tournaments: ", tournaments)
        res.status(200).json({ success: true, data: tournament[0]})
    } catch (error) {
        console.log("Error fetching tournaments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}; 

export const getTournamentBySport = async (req, res) => {
    const { sport_id } = req.params;
    try {
        const tournaments = await sql `
            SELECT * FROM tournaments 
            WHERE sport_id = ${sport_id}
            ORDER BY start_date DESC
        `
        // console.log("tournaments: ", tournaments)
        res.status(200).json({ success: true, data: tournaments})
    } catch (error) {
        console.log("Error fetching tournaments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}; 

export const getTournamentsByEvent = async (req, res) => {
    const { event_id } = req.params;
    try {
        const tournaments = await sql `
            SELECT * FROM tournaments 
            WHERE event_id = ${event_id}
        `
        // console.log("tournaments: ", tournaments)
        res.status(200).json({ success: true, data: tournaments})
    } catch (error) {
        console.log("Error fetching tournaments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createTournament = async (req, res) => {
    const {tournament_id, event_id, sport_id, name, description, start_date, end_date, location, banner_image, bracketing } = req.body;

    if(!tournament_id || !name || !start_date || !end_date || !sport_id || !bracketing  ){
        toast.error("Please fill in all required fields");
        return res.status(400).json({ success:false, message: "Enter all required fields"});
    }

    try {
        const tournament = await sql `
            INSERT INTO tournaments ( tournament_id, event_id, sport_id, name, description, start_date, end_date, location, banner_image, bracketing) 
            VALUES ( ${tournament_id}, ${event_id}, ${sport_id}, ${name}, ${description}, ${start_date}, ${end_date}, ${location}, ${banner_image}, ${bracketing})
            RETURNING *
        `
        res.status(201).json({ success: true, data: tournament[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a tournament: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error"})
    }

};

export const updateTournament = async (req, res) => {
    const { id } = req.params;
   const { event_id, sport_id, name, description, start_date, end_date, location, banner_image } = req.body;
    
    try {
        const updateTournament = await sql `
            UPDATE tournaments 
            SET event_id=${event_id}, sport_id=${sport_id}, name=${name}, description=${description}, 
            start_date=${start_date}, end_date=${end_date}, location=${location}, banner_image=${banner_image}, updated_at=CURRENT_TIMESTAMP
            WHERE tournament_id = ${id} 
            RETURNING *
        `

        if(updateTournament.length === 0){
            return res.status(404).json({ success: false, message: "sport not found"});
        }

        res.status(200).json({ success: true, data: updateTournament[0]});

    } catch (error) {
        console.log("Error updating an sport: ", error);
        console.log("BODY:", req.body);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteTournament = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTournament = await sql `
            DELETE FROM tournaments 
            WHERE tournament_id = ${id}
            RETURNING *
        `

        if(deletedTournament.length === 0){
            return res.status(404).json({ success: false, message: "tournament not found"});
        }

        res.status(200).json({ success: true, data: deletedTournament[0]});

    } catch (error) {
        console.log("Error deleting a tournament: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};
