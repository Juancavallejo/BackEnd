import express from "express";
const app = express();
import { fileURLToPath} from "url"
import path from "path";

// Logica historial de mensajes
/* import { mensajesModel } from "./models/mensajes.js";
import ContenedorMensajes from "./Contenedores/ClassMensajes.js"
const listaMensajes = new ContenedorMensajes (mensajesModel) */

import mensajes from "./Contenedores/ClassMensajesFs.js";
const listaMensajes = new mensajes ("historial.txt")

//Router - Rutas del servidor
import productsRouter from "./routes/products.js";
import carritoRouter from "./routes/carrito.js"

// Variables de entorno
const PORT = process.env.PORT || 8080

// Middlewares
app.use (express.json());
app.use (express.urlencoded ({extended : true}));

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

// -------------------------
// Rutas del servidor
app.use ("/", productsRouter);
app.use ("/carrito", carritoRouter);


// ----------------------------------
// Manejo de errores
app.use ((err,req,res,next) => {
    console.log (err);
    res.status(500).send(`Se presentó el siguiente error: ${err.message}`)
});


// ------------------------
// Configuración del Socket

io.on ("connection", async (socket) => {
    console.log ("nuevo usuario conectado", socket.id);

    // Carga inicial de productos
    io.sockets.emit ("allProducts", "http://localhost:8080/allproducts")

    // Update de productos

    // Carga inicial de mensajes 
    const historial = await listaMensajes.getAll(); 
    socket.emit("cargaMensajes", historial)

    // Actualización de mensajes 
    socket.on ("message", async (data) => {
        await listaMensajes.save(data);
        const historial = await listaMensajes.getAll(); 
        io.sockets.emit ("cargaMensajes", historial )
    })
})

