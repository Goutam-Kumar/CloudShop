const jwt = require("jsonwebtoken");
const CommonError = require("../error_module/CommonError");

// Verify jwt token middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if(err){
                next(new CommonError(err.message, 403));
            }else {
                req.user = user;
                next();
            }
        });
    } else {
        next(new CommonError("You are not authorized", 401));
    }
}

const verifyTokenAndAuth = (req, res, next) => {
    verifyToken(req,res, ()=> {
        if(req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            next(new CommonError("You are not authorized to update", 403))
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuth };