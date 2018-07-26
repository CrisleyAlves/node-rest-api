const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

//Arquivo que armazena as rotas
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/order");

// log da requisição no console
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//para a rota X, utilize as informações desta variável
app.use('/products', productRoutes);
app.use('/order', orderRoutes);

//se chegar até aqui é porque a rota não existe
app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Outros tipos de erro na aplicação
app.use((error, req, res, next)=>{ 
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;