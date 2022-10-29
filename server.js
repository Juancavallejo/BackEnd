import express from "express";
const app = express();

import ArchivoChat from "./ClassArchivoChat.js";
const mensajesGuardados = new ArchivoChat ("historial.txt")

//Router
import productsRouter from "./routes/products.js";
import carritoRouter from "./routes/carrito.js"


// Variables de entorno
const PORT = process.env.PORT || 8080

// Middlewares
app.use (express.json());
app.use (express.urlencoded ({extended : true}));

// Motor de plantillas
import handlebars from "express-handlebars";
app.engine ("handlebars", handlebars.engine());
app.set("views", "./views");
app.set ("view engine", "handlebars");

// function para levantar el servidor 
const serverExpress = app.listen (PORT, () => {
    console.log (`Server listening on port ${PORT} - Desafio 06 - Primera entrega proyecto final`)
})

//Servidor de Websocket
import { Server } from "socket.io";
const io = new Server(serverExpress);

// Express Static
/* app.use (express.static(__dirname+"/public")); */

// Rutas del servidor
app.use ("/", productsRouter);
app.use ("/carrito", carritoRouter);

// Manejo de errores
app.use ((err,req,res,next) => {
    console.log (err);
    res.status(500).send(`Se presentó el siguiente error: ${err.message}`)
});

io.on ("connection", (socket) => {
    console.log ("nuevo usuario conectado", socket.id)
    io.sockets.emit ("allProducts", "http://localhost:8080/allproducts")
    socket.on ("message", async (data) => {
        mensajesGuardados.save (data)
        io.sockets.emit ("historial", "./historial.txt")
    })
})

