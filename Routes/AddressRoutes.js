const express = require("express");

const router = express.Router();

const {

    AddAddress,
    GetAddresses,
    UpdateAddress,
    DeleteAddress

} = require("../controllers/addressesController");



/*
=====================================
ADD ADDRESS
POST:
api/address/add
=====================================
*/

router.post("/add", AddAddress);



/*
=====================================
GET USER ADDRESSES
GET:
api/address/user/1
=====================================
*/

router.get("/user/:user_id", GetAddresses);



/*
=====================================
UPDATE ADDRESS
PUT:
api/address/update/1
=====================================
*/

router.put("/update/:id", UpdateAddress);



/*
=====================================
DELETE ADDRESS
DELETE:
api/address/delete/1
=====================================
*/

router.delete("/delete/:id", DeleteAddress);



module.exports = router;