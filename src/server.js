import express from "express";
const app = express();
import { fileURLToPath} from "url"
import path from "path";

// Variables de entorno
const PORT = process.env.PORT || 8080

// ----------------------------------
// function para levantar el servidor
// ----------------------------------------
const serverExpress = app.listen (PORT, () => {
    console.log (`Server listening on port ${PORT}`)
})

// Express Static
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
/* app.use (express.static(__dirname+"/public")); */

// ----------------------------------
// Middlewares
// --------------------------------------

app.use (express.json());
app.use (express.urlencoded ({extended : true}));

// --------------------------------------
// Motor de plantillas
// --------------------------------------
import handlebars from "express-handlebars";
app.engine ("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set ("view engine", "handlebars");


// ----------------------------------
// Persistencia del login al servidor en la ruta products.
// -------------------------------
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

app.use (cookieParser());

app.use (session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/sessionsDB?retryWrites=true&w=majority"
                                //Nombre DB + password                             Nombre de la DB
    }),
    secret: "clave",
    resave: false,
    saveUninitialized: false,
}))


//Router - Rutas del servidor
//-------------------------------------------------
import productsRouter from "./routes/products.js";
import carritoRouter from "./routes/carrito.js"
app.use ("/",productsRouter);
app.use ("/carrito", carritoRouter);


// ----------------------------------
// Manejo de errores
app.use ((err,req,res,next) => {
    console.log (err);
    res.status(500).send(`Se presentó el siguiente error: ${err.message}`)
});


// ----------------------------------------
// Servidor de Websocket
// ------------------------------------------

//levantar el servidor de Websocket
import { Server } from "socket.io";
const io = new Server(serverExpress);

// Logica historial de mensajes - Enviados mediante websocket. 
import mensajes from "./Contenedores/ClassMensajesFs.js";
const listaMensajes = new mensajes ("historial.txt")

//Configuración del Socket
//------------------------------------
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

