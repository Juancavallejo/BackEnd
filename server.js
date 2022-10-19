const express = require ("express");
const app = express();

const ArchivoChat = require("./ClassArchivoChat")
const mensajesGuardados = new ArchivoChat ("historial.txt")

//Router
const productsRouter = require("./routes/products");

// Variables de entorno
const PORT = process.env.PORT || 8080

// Middlewares
app.use (express.json());
app.use (express.urlencoded ({extended : true}));

// Motor de plantillas
const handlebars = require ("express-handlebars");
app.engine ("handlebars", handlebars.engine());
app.set("views", "./views");
app.set ("view engine", "handlebars");

// function para levantar el servidor 
const serverExpress = app.listen (PORT, () => {
    console.log (`Server listening on port ${PORT} - Desafio 06 - Server con Websocket`)
})

//Servidor de Websocket
const { Server } = require ("socket.io")
const io = new Server(serverExpress);

// Express Static
app.use (express.static(__dirname+"/public"));

// Rutas del servidor
app.use ("/", productsRouter);

const historicoMensajes = []

io.on ("connection", (socket) => {
    console.log ("nuevo usuario conectado", socket.id)
    io.sockets.emit ("allProducts", "http://localhost:8080/allproducts")
    socket.on ("message", async (data) => {
        mensajesGuardados.save (data)
        io.sockets.emit ("historial", "./historial.txt")
    })
})

