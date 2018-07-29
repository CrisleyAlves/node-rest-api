const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user');
const Bcript = require("bcrypt");

router.get("/", (req, res, next)=>{
    User.find()
    .select("_id email")
    .exec()
    .then(docs =>{
        const response = {
            count: docs.length,
            users: docs.map(doc =>{
                return{
                    _id: doc.id,
                    email: doc.email
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

router.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then( result => {
        if (result.length >= 1){
            res.status(409).json({
                message: "O e-mail já existe em nossa base de dados"
            });
        }else{
            Bcript.hash(req.body.password, 10, (err, hash) =>{
                if(err){
                    res.status(500).json({
                        message: 'Ocorreu um erro ao criptografar a senha',
                        error: err
                    });
                }else{
                    const user = new User({
                        _id: mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
        
                    user.save().then( result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'Usuário criado com sucesso',
                            user: {
                                id: result.id,
                                email: result.email
                            }
                        })
                    })
                    .catch( err => {
                        res.status(500).json({
                            message: 'Ocorreu um erro ao realizar o cadastro',
                            error: err
                        })
                    })
                }
            });
        }
    })
    .catch( err => {
        res.status(500).json({
            message: "Ocorreu um erro durante a solicitação",
            error: err
        })
    });    
})

router.delete("/:userId", (req, res, next)=>{
    const id = req.params.productId;

    User.remove({ _id: id })
    .exec()
    .then( result => {
        res.status(200).json({
            message: "Usuário excluído com sucesso"
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