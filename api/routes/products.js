const express = require("express");
const router = express.Router();

router.get("/", (req, res, next)=>{
    res.status(200).json({
        message: 'GET Request'
    });
});

router.post("/", (req, res, next)=>{
    const product = {
        name: req.body.name,
        price: req.body.price
    };

    res.status(200).json({
        message: 'POST Request',
        createdProduct: product
    });
});

router.get("/:productId", (req, res, next)=>{
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message: 'GET Special id discovered',
            id: id
        }); 
    }else{
        res.status(200).json({
            message: 'GET normal id',
            id: id
        }); 
    }
});

router.patch("/:productId", (req, res, next)=>{
    res.status(200).json({
        message: 'Updated product with patch'
    });
});

router.delete("/:productId", (req, res, next)=>{
    res.status(200).json({
        message: 'Product deleted'
    });
});

module.exports = router;