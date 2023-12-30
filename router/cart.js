const CommonError = require("../error_module/CommonError");
const Cart = require("../models/Cart");
const { verifyToken } = require("./verifytoken");

const router = require("express").Router();


router.post("/", verifyToken, async (req, res, next) => {
    try {
        const newCart = new Cart(
            req.body
        );
        const savedCart = await newCart.save();
        if(savedCart){
            res.status(201).json({status: true, data: savedCart});
        }
    } catch (error) {
        next(new CommonError(error.message, 500));
    }
});

module.exports = router;