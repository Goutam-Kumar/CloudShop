const CommonError = require("../error_module/CommonError");
const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAdmin } = require("./verifytoken");

const router = require("express").Router();

// Create Product
router.post("/", verifyTokenAndAdmin, async (req, res, next) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        next(new CommonError(err.message, 500));
    }
});

// Update Product
router.put("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(new CommonError(error.message, 500));
    }
});

// Delete Product
router.delete("/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const isProdDeleted = await Product.findOneAndDelete(req.params.id);
        if (!isProdDeleted) {
            next(new CommonError("Product not found!", 404));
        } else {
            res.status(200).json({ status: true, message: "Product deleted successfully!" });
        }
    } catch (error) {
        next(new CommonError(error.message, 500));
    }
});

//Get a product details
router.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            next(new CommonError("Product not found", 404));
        } else {
            res.status(200).json({ status: true, data: product });
        }
    } catch (error) {
        next(new CommonError(error.message, 500));
    }
});

// Get all products
router.get("/", verifyToken, async (req, res, next) => {
    
    try {
        const qCategory = req.query.category;
        let products;
        if(qCategory){
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            });
            res.status(200).json({ status: true, data: products });
        } else {
            products = await Product.find();
            res.status(200).json({ status: true, data: products });
        }
        
    } catch (error) {
        next(new CommonError(error.message, 500))
    }
});

module.exports = router;