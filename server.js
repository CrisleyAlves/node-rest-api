const http = require('http');
const app = require("./app");

//Tenta acessar variável de ambiente, senão porta 3000
const port = process.env.PORT || 3000;

//criar o servidor
const server = http.createServer(app);

//starta o server na porta especificada
server.listen(port);