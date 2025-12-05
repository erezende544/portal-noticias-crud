const jsonServer = require('json-server');
const cors = require('cors');
const server = jsonServer.create();
const router = jsonServer.router('db/db.json');
const middlewares = jsonServer.defaults();

// Habilitar CORS
server.use(cors());

server.use(middlewares);
server.use(router);

server.listen(3030, () => {
    console.log('JSON Server está rodando na porta 3030');
});