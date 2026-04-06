import { sql } from "../config/db.js";

// status: 200(ok), 201(created), 400(invalid req), 500(server crashed), 404(not found)

export const getDepartments = async (req, res) => {
    try {
        const departments = await sql `
            SELECT * FROM departments 
            ORDER BY created_at DESC
        `
        res.status(200).json({ success: true, data: departments})
    } catch (error) {
        console.log("Error fetching departments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const getDepartmentById = async (req, res) => {
    const {id} = req.params;
    try {
        const department = await sql `
            SELECT * FROM departments 
            WHERE department_id = ${id}
        `
        res.status(200).json({ success: true, data: department})
    } catch (error) {
        console.log("Error fetching departments: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};


export const createDepartment = async (req, res) => {
    const { name, abbreviation, logo } = req.body;

    if(!name){
        return res.status(400).json({ success:false, message: "name is required" })
    }

    try {
        const department = await sql `
            INSERT INTO departments (name, abbreviation, logo) 
            VALUES (${name}, ${abbreviation}, ${logo})
            RETURNING *
        `
        console.log("New department added successfully");
        res.status(201).json({ success: true, data: department[0]}); //it returns array

    } catch (error) {
        console.log("Error creating an department: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name, abbreviation, logo } = req.body;

    try {
        const updateDepartment = await sql `
            UPDATE departments 
            SET name=${name}, abbreviation=${abbreviation}, 
            logo=${logo}, updated_at=CURRENT_TIMESTAMP
            WHERE department_id = ${id}
            RETURNING *
        `

        if(updateDepartment.length === 0){
            return res.status(404).json({ success: false, message: "department not found"});
        }

        console.log("department updated successfully");
        res.status(200).json({ success: true, data: updateDepartment[0]});

    } catch (error) {
        console.log("Error updating an department: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteDepartment = await sql `
            DELETE FROM departments WHERE department_id = ${id}
            RETURNING *
        `

        if(deleteDepartment.length === 0){
            return res.status(404).json({ success: false, message: "department not found"});
        }

        console.log("department deleted successfully");
        res.status(200).json({ success: true, data: deleteDepartment[0]});

    } catch (error) {
        console.log("Error deleting an department: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};