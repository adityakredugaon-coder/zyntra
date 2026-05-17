const express = require("express");

const router = express.Router();

const {

    AddAddress,
    GetAddresses,
    UpdateAddress,
    DeleteAddress

} = require("../controllers/addressesController");

const authMiddleware = require("../middleware/AuthMiddleWare");



/*
=====================================
ADD ADDRESS
POST:
api/address/add
=====================================
*/

router.post(
    "/add",
    authMiddleware,
    AddAddress
);



/*
=====================================
GET CURRENT USER ADDRESSES
GET:
api/address/get
=====================================
*/

router.get(
    "/my-address",
    authMiddleware,
    GetAddresses
);



/*
=====================================
UPDATE ADDRESS
PUT:
api/address/update/1
=====================================
*/

router.put(
    "/update/:id",
    authMiddleware,
    UpdateAddress
);



/*
=====================================
DELETE ADDRESS
DELETE:
api/address/delete/1
=====================================
*/

router.delete(
    "/delete/:id",
    authMiddleware,
    DeleteAddress
);



module.exports = router;