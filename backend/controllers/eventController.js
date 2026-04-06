import { sql } from "../config/db.js";

// status: 200(ok), 201(created), 400(invalid req), 500(server crashed), 404(not found)

export const getEvents = async (req, res) => {
    try {
        const events = await sql `
            SELECT * FROM events 
            ORDER BY created_at DESC
        `
        res.status(200).json({ success: true, data: events})
    } catch (error) {
        console.log("Error fetching events: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createEvent = async (req, res) => {
    const { event_id, name, description, start_date, end_date, location, banner_image } = req.body;

    if(!event_id || !name || !start_date || !end_date ){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const event = await sql `
            INSERT INTO events (event_id, name, description, start_date, end_date, location, banner_image) 
            VALUES (${event_id}, ${name}, ${description}, ${start_date}, ${end_date}, ${location}, ${banner_image})
            RETURNING *
        `
        console.log("New event added successfully");
        res.status(201).json({ success: true, data: event[0]}); //it returns array

    } catch (error) {
        console.log("Error creating an event: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, description, start_date, end_date, location, banner_image } = req.body;

    try {
        const updateEvent = await sql `
            UPDATE events 
            SET name=${name}, description=${description}, 
            start_date=${start_date}, end_date=${end_date}, location=${location}, banner_image=${banner_image},
            updated_at=CURRENT_TIMESTAMP
            WHERE event_id = ${id}
            RETURNING *
        `

        if(updateEvent.length === 0){
            return res.status(404).json({ success: false, message: "event not found"});
        }

        console.log("event updated successfully");
        res.status(200).json({ success: true, data: updateEvent[0]});

    } catch (error) {
        console.log("Error updating an event: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteEvent = await sql `
            DELETE FROM events WHERE event_id = ${id}
            RETURNING *
        `

        if(deleteEvent.length === 0){
            return res.status(404).json({ success: false, message: "event not found"});
        }

        console.log("event deleted successfully");
        res.status(200).json({ success: true, data: deleteEvent[0]});

    } catch (error) {
        console.log("Error deleting an event: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const event = await sql `
            SELECT * FROM events WHERE event_id = ${id}
        `

        if(event.length === 0){
            return res.status(404).json({ success: false, message: "event not found"});
        }

        console.log("event fetched successfully");
        res.status(200).json({ success: true, data: event[0]});

    } catch (error) {
        console.log("Error fetching an event: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};