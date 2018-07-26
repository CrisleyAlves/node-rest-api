const express = require("express");
const router = express.Router();

router.get("/", (req, res, next)=>{
    res.status(200).json({
        message: 'GET Request on Order'
    });
});

router.get("/:orderId", (req, res, next)=>{
    res.status(200).json({
        message: 'GET specific order',
        id: req.params.orderId
    }); 
});

router.post("/", (req, res, next)=>{
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    }
    res.status(200).json({
        message: 'POST Request  on Order',
        order: order
    });
});

module.exports = router;