const express = require ("express");
const productsRouter = require ("./routes/products");


const app = express();

app.use (express.json());
app.use (express.urlencoded ({extended : true}));

app.use ("/api/productos", productsRouter);


app.get ("/", (req, res) => {
    res.send ("Bienvenido al servidor, desafio 04")
})


app.listen (8080, () => {
    console.log ("Server listening on port 8080 - Desafio 04")
})



