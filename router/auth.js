const User = require("../models/User");
const router = require("express").Router();
const cryptoJS = require("crypto-js");
const CommonError = require("../error_module/CommonError");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res, next) => {
    const newUser = new User(
        {
            username: req.body.username,
            email: req.body.email,
            password: cryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC),
        });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        next(err);
    }
});

//Login
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({
            username: req.body.username
        });

        if (user == null) {
            throw new CommonError('Username not available', 401);
        } else {
            const hashedPassword = cryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
            const dcPassword = hashedPassword.toString(cryptoJS.enc.Utf8);

            if (dcPassword !== req.body.password) {
                throw new CommonError('Wrong credential', 401);
            } else {
                const accessToken = jwt.sign({
                    id: user._id, isAdmin: user.isAdmin
                }, process.env.JWT_SEC, {expiresIn: "1d"});
                //Removing password from the user response body
                const { password, ...others } = user._doc;

                res.status(200).json({...others,accessToken});
            }
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router