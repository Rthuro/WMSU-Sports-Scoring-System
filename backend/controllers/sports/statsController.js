import { sql } from "../../config/db.js";


export const getSportStats = async (req, res) => {

    try {
        const stats = await sql `
            SELECT * FROM stats 
        `
        res.status(200).json({ success: true, data: stats})
    } catch (error) {
        console.log("Error fetching stats: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createStat = async (req, res) => {
    const { sportId, stats_name, is_player_stat } = req.body;

    if(!sportId || !stats_name ){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const stat = await sql `
            INSERT INTO stats ( sport_id , stats_name, is_player_stat) 
            VALUES ( ${sportId} , ${stats_name}, ${is_player_stat})
            RETURNING *
        `
        console.log("New stat added successfully");
        res.status(201).json({ success: true, data: stat[0]}); //it returns array

    } catch (error) {
        console.log("Error creating a stat: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateStat = async (req, res) => {
    const { id } = req.params;
    const { stats_name, is_player_stat } = req.body;
    
    try {
        const updateStat = await sql `
            UPDATE stats 
            SET stats_name = ${stats_name}, is_player_stat = ${is_player_stat}
            WHERE stats_id = ${id}
            RETURNING *
        `

        if(updateStat.length === 0){
            return res.status(404).json({ success: false, message: "stat not found"});
        }

        console.log("stat updated successfully");
        res.status(200).json({ success: true, data: updateStat[0]});

    } catch (error) {
        console.log("Error updating an stat: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteStat = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteStat = await sql `
            DELETE FROM stats WHERE stats_id = ${id}
            RETURNING *
        `

        if(deleteStat.length === 0){
            return res.status(404).json({ success: false, message: "stat not found"});
        }

        console.log("stat deleted successfully");
        res.status(200).json({ success: true, data: deleteStat[0]});

    } catch (error) {
        console.log("Error deleting a stat: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};