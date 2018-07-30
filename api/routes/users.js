const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/user');
const Bcript = require("bcrypt");
const jwt = require("jsonwebtoken");

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

router.post("/login", (req, res, next)=>{
    User.find( {email: req.body.email} )
    .exec()
    .then( user => {
        //caso não tenha nenhum usuário com o email informado
        if(user.length === 0){
            res.status(401).json({
                message: "A autenticação falhou",
                error: err
            });
        }
        
        //compara a senha enviada com a senha no banco
        //Bcript função da própria biblioteca que realiza comparação
        Bcript.compare(req.body.password, user[0].password, (err, result) =>{
            //result retorna verdadeiro ou false
            if(!result){
                res.status(401).json({
                    message: "A autenticação falhou",
                    error: err
                });
            }else{
                
                //  1º parâmetro -> vai ser gerado um token para validação com base neste primeiro objeto(id, email)
                //  2º parâmetro -> JWT_SECRET_KEY -> chave secreta do servidor para geração do token
                //  3º parâmetro -> Período que a chave será válida
                const token = jwt.sign({
                    id: user[0]._id,
                    email: user[0].email
                },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: '1h'
                });

                res.status(200).json({
                    message: "Login realizado com sucesso",
                    token: token
                })
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "A autenticação falhou",
            error: err
        })
    })
});

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