"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _url = require("url");

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _connectMongo = require("connect-mongo");

var _connectMongo2 = _interopRequireDefault(_connectMongo);

var _config = require("./options/configNew.js");

var _cluster = require("cluster");

var _cluster2 = _interopRequireDefault(_cluster);

var _apiInfo = require("./routes/apiInfoNew.js");

var _apiInfo2 = _interopRequireDefault(_apiInfo);

var _expressHandlebars = require("express-handlebars");

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

 var _products = require("./routes/productsNew.js");

 var _products2 = _interopRequireDefault(_products);

 var _carrito = require("./routes/carrito.js");

 var _carrito2 = _interopRequireDefault(_carrito);

 var _login = require("./routes/loginNew.js");

 var _login2 = _interopRequireDefault(_login);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
/* import {passportLocalAuth} from "./passport/local-auth" */


// Variables de entorno
var PORT = _config.config.PORT;
var MODO = _config.config.MODO;

// ----------------------------------
// function para levantar el servidor
// ----------------------------------------
/* if (cluster.isPrimary) {
    for (let i=0; i<numeroCPUs; i++) {
        cluster.fork();
    }
} else {
    app.listen (PORT, () => {
        console.log (`Server listening on port ${PORT}, modo ${MODO},on process ID ${process.pid}`)
    })
} */

var serverExpress = app.listen(PORT, function () {
    console.log("Server listening on port " + PORT + ", modo " + MODO + ",on process ID " + process.pid);
});

// Express Static
/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename) */
/* app.use (express.static(__dirname+"/public")); */

// ----------------------------------
// Middlewares
// --------------------------------------
app.use((0, _morgan2.default)("dev"));
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true })); // Recibir datps desde formulario en navegador
// Configuración de las sessions
app.use((0, _cookieParser2.default)());
app.use((0, _expressSession2.default)({
    store: _connectMongo2.default.create({
        mongoUrl: "mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/sessionsDB?retryWrites=true&w=majority"
        //Nombre DB + password                             Nombre de la DB
    }),
    secret: "clave",
    resave: false,
    saveUninitialized: false
}));
// Configuración de passport
app.use(_passport2.default.initialize()); // Conectar passport con express,
app.use(_passport2.default.session()); // Vincular passport con las sessions de los usuarios

// --------------------------------------
// Motor de plantillas
// --------------------------------------

/* app.engine("handlebars", _expressHandlebars2.default.engine());
app.set("views", _path2.default.join(__dirname, "views"));
app.set("view engine", "handlebars"); */

//Router - Rutas del servidor
//-------------------------------------------------

app.get("/", function (req, res) {
    res.send("Respuesta desde el puerto " + PORT + " en el proceso " + process.pid);
});

app.use("/", _products2.default);
app.use("/carrito", _carrito2.default);
app.use("/", _login2.default);
app.use("/api", _apiInfo2.default);

// ----------------------------------
// Manejo de errores
app.use(function (err, req, res, next) {
    console.log(err);
    res.status(500).send("Se present\xF3 el siguiente error: " + err.message);
});

// ----------------------------------------
// Servidor de Websocket
// ------------------------------------------

//levantar el servidor de Websocket
/* import { Server } from "socket.io";
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
})  */
