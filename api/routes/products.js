const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/product");

router.get("/", (req, res, next)=>{

    Product.find()
    .exec()
    .then(docs =>{
        console.log(docs);
        res.status(200).json(docs);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

router.post("/", (req, res, next)=>{
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        res.status(200).json({
            message: 'POST Request',
            createdProduct: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get("/:productId", (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then( doc => {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json({
                message: "O ID informado não existe na nossa base de dados"
            })
        }
    })
    .catch(err => {
        res.status(500).json({teste: err});
    });
});

router.patch("/:productId", (req, res, next)=>{
    const id = req.params.productId;

    const updateAttr = {};

    for(const attr of req.body){
        updateAttr[attr.propName] = attr.value;
    }

    Product.update({_id: id}, { $set : updateAttr })
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({result})
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete("/:productId", (req, res, next)=>{
    const id = req.params.productId;

    Product.remove({ _id: id })
    .exec()
    .then( result => {
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: res
        })
    })
});

module.exports = router;