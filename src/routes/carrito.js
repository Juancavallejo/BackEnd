import express  from "express";
const carritoRouter = express.Router ();

// Logica relacionada a la base de datos MySql 
// Llamada al contenedor de carrito y sus metodos:
import Carrito from "../Contenedores/ClassCarrito.js";
const carrito = new Carrito ("carrito.txt")

// Logica relacionada a la base de datos de MongoDB
//Import de los modelos de carritos - MongoDB
import { carritoModel } from "../models/carrito.js";
// LLamada al contenedor de carritos y sus metodos:
import CarritoMongo from "../Contenedores/ClassCarritoMongodb.js";
const carritoMongo = new CarritoMongo(carritoModel)

// Function para verificar rol. Por el momento se encuentra en poder acceder a todas las rutas.
const verificarRol = (req,res,next) => {
    const rol = "client";
    if (rol === "client") {
        next();
    } else {
        res.send ("No tienes acceso a la ruta")
    }
}

//Obtener todos los productos guardados

carritoRouter.get ("/allcarritos", async (req, res) => {
    const allCarritos = await carritoMongo.getAllCarritos()
    if (allCarritos) {
        res.status(200).send (allCarritos)
        // res.status(200).json ({
        //     message: "Lista de ordenes de compra",
        //     response: allCarritos
        // })
    } else {
        res.status(404).send (`Lo sentimos, no hay carritos para mostrar`)
    }
})

// Crear carrito y devuelve id
carritoRouter.post ("/", verificarRol,async (req, res) => {
    const newCarrito = await carritoMongo.crearCarrito()
    res.status(200).json (`Carrito creado con Id Nro ${newCarrito.codigo} y con fecha ${newCarrito.timestamp}`)
})

// Delete all carrito
carritoRouter.delete ("/delete/:carritoId",verificarRol, async (req, res) => {
    const {carritoId} = req.params;
    const carritoDeleted = await carritoMongo.deleteById(carritoId)
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} ha sido eliminado, nueva lista de carritos:`,
        response: carritoDeleted
    })
})

//Buscar carrito por Id y mostrar todos los productos
carritoRouter.get ("/allcarritos/:carritoId", async (req, res) => {
    const {carritoId} = req.params;
    const carritoFiltred = await carritoMongo.getById(carritoId)
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} tiene los siguientes productos`,
        response: carritoFiltred
    }) 
})

// Incorporar productos al carrito
carritoRouter.post ("/:carritoId/:productId",verificarRol, async (req, res) => {
    const {carritoId, productId} = req.params;
    await carritoMongo.anadirProducto(carritoId, productId);
    const carritoFinal = await carritoMongo.getById(carritoId)
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha añadido el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 
})

// Delete productos del carrito
carritoRouter.delete ("/:carritoId/:productId", verificarRol, async (req,res) => {
    const {carritoId, productId} = req.params;
    await carritoMongo.deleteProducto (carritoId, productId)
    const carritoFinal = await carritoMongo.getById(carritoId)
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha eliminado el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 

})

export default carritoRouter
