const CommonError = require("../error_module/CommonError");
const User = require("../models/User");
const { verifyToken, verifyTokenAndAuth } = require("./verifytoken");
const router = require("express").Router();
const cryptoJS = require("crypto-js");

// Update user
router.put("/:id", verifyTokenAndAuth, async (req, res, next) => {
    if (req.body.password) {
        req.body.password = cryptoJS.AES.encrypt(
            req.body.password, process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        const { password, ...others } = updatedUser._doc;
        res.status(200).json(others);
    } catch (err) {
        next(err);
    }
});

// Delete user
router.delete("/:id", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const deletedTask = await User.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            next(new CommonError("Requested User not found", 404));
        } else {
            res.status(200).json({ status: true, message: "User've been deleted!" });
        }
    } catch (err) {
        next(err);
    }
});

// Find the user by userId
router.get("/:id", verifyTokenAndAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            next(new CommonError("Requested User not found", 404));
        } else {
            const { password, ...others } = user._doc;
            res.status(200).json(others);
        }
    } catch (err) {
        next(err);
    }
});

// Get all users
router.get("/", verifyToken, async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users) {
            next(new CommonError("Resource not found", 404));
        } else {
            res.status(200).json(users);
        }
    } catch (err) {
        next(err);
    }
});


module.exports = router;