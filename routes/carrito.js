import express  from "express";
const carritoRouter = express.Router ();

import Carrito from "../Contenedores/ClassCarrito.js";
const carrito = new Carrito ("carrito.txt")

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
    const allCarritos = await carrito.getAllCarritos()
    if (allCarritos) {
        res.status(200).json ({
            message: "Lista de ordenes de compra",
            response: allCarritos
        })
    } else {
        res.status(404).send (`Lo sentimos, no hay carritos para mostrar`)
    }
})

// Crear carrito y devuelve id
carritoRouter.post ("/", verificarRol,async (req, res) => {
    const newCarrito = await carrito.crearCarrito()
    res.status(200).json (`Carrito creado con Id Nro ${newCarrito.id} y con fecha ${newCarrito.timestamp}`)
})

// Delete all carrito
carritoRouter.delete ("/delete/:carritoId",verificarRol, async (req, res) => {
    const allCarritos = await carrito.getAllCarritos();
    const {carritoId} = req.params;
    const newArray = allCarritos.filter (el => el.id !== parseInt(carritoId))
    await carrito.deleteById(carritoId)
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} ha sido eliminado, nueva lista de carritos`,
        response: newArray
    })
})

//Buscar carrito por Id y mostrar todos los productos
carritoRouter.get ("/allcarritos/:carritoId", async (req, res) => {
    const allCarritos = await carrito.getAllCarritos();
    const {carritoId} = req.params;
    const newArray = allCarritos.find (el => el.id === parseInt(carritoId))
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} tiene los siguientes productos`,
        response: newArray.products
    }) 
})

// Incorporar productos al carrito
carritoRouter.post ("/:carritoId/:productId",verificarRol, async (req, res) => {
    const {carritoId, productId} = req.params;
    const carritoFinal = await carrito.anadirProducto(carritoId, productId);
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha añadido el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 
})

// Delete productos del carrito
carritoRouter.delete ("/:carritoId/:productId", verificarRol, async (req,res) => {
    const {carritoId, productId} = req.params;
    const carritoFinal = await carrito.deleteProducto (carritoId, productId)
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha eliminado el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 

})

export default carritoRouter
