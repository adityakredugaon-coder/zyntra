const db = require("../config/db");



/*
=====================================
ADD ADDRESS
=====================================
*/

exports.AddAddress = async (req, res) => {

    console.log("BODY:", req.body);

    try {

        const {

            user_id,
            fullName,
            mobile,
            pincode,
            state,
            city,
            houseNo,
            area,
            landmark,
            addressType,
            isDefault

        } = req.body || {};



        // REQUIRED FIELDS VALIDATION

        if (
            !user_id ||
            !fullName ||
            !mobile ||
            !pincode ||
            !state ||
            !city ||
            !houseNo ||
            !area
        ) {

            return res.status(400).json({

                success: false,
                message: "All Required Fields Are Mandatory"
            });
        }



        // REMOVE OLD DEFAULT ADDRESS

        if (isDefault) {

            await db.query(

                "UPDATE addresses SET isDefault = false WHERE user_id = ?",

                [user_id]
            );
        }



        // INSERT ADDRESS

        const sql = `

            INSERT INTO addresses
            (
                user_id,
                fullName,
                mobile,
                pincode,
                state,
                city,
                houseNo,
                area,
                landmark,
                addressType,
                isDefault
            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;



        const [result] = await db.query(

            sql,

            [
                user_id,
                fullName,
                mobile,
                pincode,
                state,
                city,
                houseNo,
                area,
                landmark || "",
                addressType || "Home",
                isDefault || false
            ]
        );



        return res.status(201).json({

            success: true,
            message: "Address Added Successfully",
            addressId: result.insertId
        });

    } catch (error) {

        console.log("ADD ADDRESS ERROR:", error);

        return res.status(500).json({

            success: false,
            message: error.message
        });
    }
};





/*
=====================================
GET USER ADDRESSES
=====================================
*/

exports.GetAddresses = async (req, res) => {

    try {

        const user_id = req.params.user_id;



        const [addresses] = await db.query(

            `SELECT * FROM addresses
             WHERE user_id = ?
             ORDER BY isDefault DESC, id DESC`,

            [user_id]
        );



        return res.status(200).json({

            success: true,
            total: addresses.length,
            data: addresses
        });

    } catch (error) {

        console.log("GET ADDRESS ERROR:", error);

        return res.status(500).json({

            success: false,
            message: error.message
        });
    }
};





/*
=====================================
UPDATE ADDRESS
=====================================
*/

exports.UpdateAddress = async (req, res) => {

    try {

        const id = req.params.id;

        const {

            user_id,
            fullName,
            mobile,
            pincode,
            state,
            city,
            houseNo,
            area,
            landmark,
            addressType,
            isDefault

        } = req.body || {};



        // CHECK ADDRESS EXIST

        const [existing] = await db.query(

            "SELECT * FROM addresses WHERE id = ?",

            [id]
        );



        if (existing.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Address Not Found"
            });
        }



        // REMOVE OLD DEFAULT

        if (isDefault) {

            await db.query(

                "UPDATE addresses SET isDefault = false WHERE user_id = ?",

                [user_id]
            );
        }



        // UPDATE ADDRESS

        const sql = `

            UPDATE addresses

            SET

            fullName = ?,
            mobile = ?,
            pincode = ?,
            state = ?,
            city = ?,
            houseNo = ?,
            area = ?,
            landmark = ?,
            addressType = ?,
            isDefault = ?

            WHERE id = ?
        `;



        await db.query(

            sql,

            [
                fullName,
                mobile,
                pincode,
                state,
                city,
                houseNo,
                area,
                landmark || "",
                addressType || "Home",
                isDefault || false,
                id
            ]
        );



        return res.status(200).json({

            success: true,
            message: "Address Updated Successfully"
        });

    } catch (error) {

        console.log("UPDATE ADDRESS ERROR:", error);

        return res.status(500).json({

            success: false,
            message: error.message
        });
    }
};





/*
=====================================
DELETE ADDRESS
=====================================
*/

exports.DeleteAddress = async (req, res) => {

    try {

        const id = req.params.id;



        // CHECK ADDRESS EXIST

        const [existing] = await db.query(

            "SELECT * FROM addresses WHERE id = ?",

            [id]
        );



        if (existing.length === 0) {

            return res.status(404).json({

                success: false,
                message: "Address Not Found"
            });
        }



        // DELETE ADDRESS

        await db.query(

            "DELETE FROM addresses WHERE id = ?",

            [id]
        );



        return res.status(200).json({

            success: true,
            message: "Address Deleted Successfully"
        });

    } catch (error) {

        console.log("DELETE ADDRESS ERROR:", error);

        return res.status(500).json({

            success: false,
            message: error.message
        });
    }
};