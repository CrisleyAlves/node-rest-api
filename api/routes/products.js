const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

router.get("/", (req, res, next)=>{

    Product.find()
    .select("_id name price")
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    _id: doc.id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: 'GET',
                        url: process.env.PROJECT_SERVER_PATH+'/products/'+doc.id
                    }
                }
            })
        }
        res.status(200).json(response);
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
        res.status(201).json({
            message: 'Produto criado com sucesso',
            createdProduct: {
                _id: result.id,
                name: result.name,
                price: result.price,
                request: {
                    type: 'GET',
                    url: process.env.PROJECT_SERVER_PATH+'/products/'+result.id
                }
            }
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
    .select('_id name price')
    .exec()
    .then( doc => {
        if(doc){
            res.status(200).json({
                message: "Informações do produto",
                product: {
                    _id: doc.id,
                    name: doc.name,
                    price: doc.price
                }
            });
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
        res.status(200).json({
                message: 'Produto atualizado com sucesso',
                request: {
                    type: 'GET',
                    url: process.env.PROJECT_SERVER_PATH+'/products/'+id
                }       
            });
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
        res.status(200).json({
            message: "Produto excluído com sucesso"
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error: res
        })
    })
});

module.exports = router;