import express from "express";
const app = express();
import { fileURLToPath} from "url"
import path from "path";

// Logica historial de mensajes
import ContenedorMensajesSql from "./ClassMensajesSql.js";
const listaMensajes = new ContenedorMensajesSql ("mensajes")

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
    console.log (`Server listening on port ${PORT}`)
})

//Servidor de Websocket
import { Server } from "socket.io";
const io = new Server(serverExpress);

// Express Static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
app.use (express.static(__dirname+"/public"));

// Rutas del servidor
app.use ("/", productsRouter);
app.use ("/carrito", carritoRouter);

// Manejo de errores
app.use ((err,req,res,next) => {
    console.log (err);
    res.status(500).send(`Se presentó el siguiente error: ${err.message}`)
});

io.on ("connection", async (socket) => {
    console.log ("nuevo usuario conectado", socket.id)
    // Carga de productos
    io.sockets.emit ("allProducts", "http://localhost:8080/allproducts")

    // Carga de mensajes 
    const historialInicial = await listaMensajes.getAll(); 
    socket.emit("cargaMensajes", historialInicial )

    // Actualización de mensajes 
    socket.on ("message", async (data) => {
        listaMensajes.save(data);
        const historial = await listaMensajes.getAll(); 
        io.sockets.emit ("historial", historial)
    })
})

