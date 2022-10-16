const express = require ("express");
const productsRouter = require ("./routes/products");
const port = 8080
const app = express();

// Middlewares
app.use (express.json());
app.use (express.urlencoded ({extended : true}));

// Motor de plantillas
app.set("views", "./views");
app.set ("view engine", "ejs");

// Rutas del servidor
app.use ("/", productsRouter);


// function para levantar el servidor 
app.listen (port, () => {
    console.log (`Server listening on port ${port} - Desafio 05 - Server con EJS`)
})



