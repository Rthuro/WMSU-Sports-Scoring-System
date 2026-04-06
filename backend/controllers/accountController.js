import { sql } from "../config/db.js";

// status: 200(ok), 201(created), 400(invalid req), 500(server crashed), 404(not found)

export const getAccounts = async (req, res) => {
    try {
        const accounts = await sql `
            SELECT * FROM accounts 
            ORDER BY created_at DESC
        `
        console.log("accounts: ", accounts)
        res.status(200).json({ success: true, data: accounts})
    } catch (error) {
        console.log("Error fetching accounts: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
};

export const createAccount = async (req, res) => {
    const { firstName, lastName, middleName, role, email, passwordHash } = req.body;

    if(!firstName || !lastName || !role || !email || !passwordHash){
        return res.status(400).json({ success:false, message: "Enter all required fields" })
    }

    try {
        const account = await sql `
            INSERT INTO accounts (first_name, last_name, middle_name, role, email, password_hash) 
            VALUES (${firstName}, ${lastName}, ${middleName}, ${role}, ${email}, ${passwordHash})
            RETURNING *
        `
        console.log("New account added successfully");
        res.status(201).json({ success: true, data: account[0]}); //it returns array

    } catch (error) {
        console.log("Error creating an account: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};

export const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, middleName, role, email, passwordHash } = req.body;

    try {
        const updateAccount = await sql `
            UPDATE accounts 
            SET first_name=${firstName}, last_name=${lastName}, 
            middle_name=${middleName}, role=${role}, email=${email}, password_hash=${passwordHash}
            WHERE account_id = ${id}
            RETURNING *
        `

        if(updateAccount.length === 0){
            return res.status(404).json({ success: false, message: "Account not found"});
        }

        console.log("Account updated successfully");
        res.status(200).json({ success: true, data: updateAccount[0]});

    } catch (error) {
        console.log("Error updating an account: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
    
};

export const deleteAccount = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteAccount = await sql `
            DELETE FROM accounts WHERE account_id = ${id}
            RETURNING *
        `

        if(deleteAccount.length === 0){
            return res.status(404).json({ success: false, message: "Account not found"});
        }

        console.log("Account deleted successfully");
        res.status(200).json({ success: true, data: deleteAccount[0]});

    } catch (error) {
        console.log("Error deleting an account: ", error);
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }

};