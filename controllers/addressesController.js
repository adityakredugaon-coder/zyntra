const db = require("../config/db");


// ================= ADD ADDRESS =================

exports.AddAddress = async (req, res) => {

    try {

        const user_id = req.user.id;

        const {
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
        } = req.body;


        if (
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
                message: "All fields required"
            });
        }


        if (isDefault) {

            await db.query(
                "UPDATE addresses SET isDefault = false WHERE user_id = ?",
                [user_id]
            );
        }


        const sql = `
        INSERT INTO addresses (
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


        const [result] = await db.query(sql, [
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
        ]);


        res.status(201).json({
            success: true,
            message: "Address added",
            id: result.insertId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= GET ADDRESS =================

exports.GetAddresses = async (req, res) => {

    try {

        const user_id = req.user.id;

        const [addresses] = await db.query(
            `SELECT * FROM addresses
             WHERE user_id = ?
             ORDER BY isDefault DESC, id DESC`,
            [user_id]
        );

        res.status(200).json({
            success: true,
            data: addresses
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= UPDATE ADDRESS =================

exports.UpdateAddress = async (req, res) => {

    try {

        const id = req.params.id;

        const user_id = req.user.id;

        const {
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
        } = req.body;


        const [check] = await db.query(
            "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
            [id, user_id]
        );


        if (check.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }


        if (isDefault) {

            await db.query(
                "UPDATE addresses SET isDefault = false WHERE user_id = ?",
                [user_id]
            );
        }


        await db.query(
            `UPDATE addresses SET
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
            WHERE id = ?`,
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


        res.status(200).json({
            success: true,
            message: "Address updated"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ================= DELETE ADDRESS =================

exports.DeleteAddress = async (req, res) => {

    try {

        const id = req.params.id;

        const user_id = req.user.id;


        const [check] = await db.query(
            "SELECT * FROM addresses WHERE id = ? AND user_id = ?",
            [id, user_id]
        );


        if (check.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }


        await db.query(
            "DELETE FROM addresses WHERE id = ?",
            [id]
        );


        res.status(200).json({
            success: true,
            message: "Address deleted"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};