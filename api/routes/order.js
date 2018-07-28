const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
    Order.find()
        .select('_id quantity product')
        .populate('product', 'id name price') // faz um join entre Order x Product - TOP =)
        .exec()
        .then(result => {
            res.status(200).json({
                cout: result.length,
                message: "Requisição realizada com sucesso",
                orders: result.map(doc => {
                    return {
                        _id: doc._id,
                        quantity: doc.quantity,
                        product: doc.product
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Ocorreu um erro durante a solicitação",
                error: err
            })
        });
});

router.get("/:orderId", (req, res, next) => {
    Order.findById(req.params.orderId)
    .select('_id product quantity')
    .exec()
    .then( result =>{
        res.status(200).json({
            _id: result.id,
            quantity: result.quantity,
            product: result.product
        })
    })
    .catch( err => {
        res.status(500).json({
            message: "Ocorreu um erro ao carregar o pedido informado",
            error: err
        })
    });

});

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)
    .exec()
    .then(product => {
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: product.id
        });
        order.save()
        .then(result => {
            res.status(201).json({
                message: "Pedido solicitado com sucesso",
                order: {
                    _id: result.id,
                    quantity: result.quantity,
                    product: result.product,
                    request: {
                        type: 'GET',
                        url: process.env.PROJECT_SERVER_PATH + 'products/' + result.product
                    }
                }
            })
        })
        .catch( err => {
            res.status(500).json({
                message: "Ocorreu um erro ao realizar o pedido",
                error: err    
            })
        })
    })
    .catch( err => {
        res.status(404).json({
            message: "O produto selecionado não existe",
            error: err
        })
    });
});

router.delete("/:orderId", (req, res, next)=>{
    const id = req.params.orderId;

    Order.remove({ _id: id })
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Pedido excluído com sucesso"
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