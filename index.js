const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CommonError = require("./error_module/CommonError");
const userRouter = require("./router/user");
const authRouter = require("./router/auth");
const productRoute = require("./router/product");
const cartRoute = require("./router/cart");

//Invoke dotenv configuration
dotenv.config();

//Mongo DB connection
mongoose.connect(
    process.env.MONGO_URL
).then(() => {
    console.log("DB connection successful");
}).catch((err) => {
    console.log(err);
})

// Middleware to parse JSON in the request body
app.use(express.json());

// Router middleware
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        status: false,
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
});

app.listen(8000, () => {
    console.log("Cloudshop server is running");
})