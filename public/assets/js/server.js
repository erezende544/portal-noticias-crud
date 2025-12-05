// server.js
import jsonServer from "json-server";
import cors from "cors";

const server = jsonServer.create();
const router = jsonServer.router("db/db.json");
const middlewares = jsonServer.defaults();

// Configuração CORS para Replit
server.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

server.use(middlewares);
server.use(router);

// Para Replit, sempre use process.env.PORT
const PORT = process.env.PORT || 3030;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ JSON Server rodando na porta ${PORT}`);
    console.log(`🌐 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
});