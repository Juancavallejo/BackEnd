import express  from "express";
const productsRouter = express.Router ();

// Logica relacionada a la base de datos de MongoDB
//Import de los modelos de productos - MongoDB
import { productModel } from "../models/products.js";
// LLamada al contenedor de productos y sus metodos:
import ContenedorProductosMongo from "../Contenedores/ClassProductsMongodb.js";
const listaItemsMongo = new ContenedorProductosMongo(productModel)

// Logica relacionada a la base de datos MySql 
// Llamada al contenedor de productos y sus metodos:
import ContenedorProductos from "../Contenedores/ClassProductsMySql.js";
const listaItems = new ContenedorProductos ("products")


// Function para verificar rol. Por el momento se encuentra en poder acceder a todas las rutas.
const verificarRol = (req,res,next) => {
    const rol = "admin";
    if (rol === "admin") {
        next();
    } else {
        res.send ("No tienes acceso a la ruta")
    }
}


//Obtener todos los productos guardados
productsRouter.get ("/allproducts", async (req, res) => {
    const allProducts = await listaItemsMongo.getAll()
    if (allProducts) {
        res.status(200).send (allProducts)
/*         res.status(200).json ({
            message: "Lista de productos",
            response: allProducts
        }) */
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})

// Busqueda de producto por ID. 
productsRouter.get ("/allproducts/:productId", async (req, res) => {
    const {productId} = req.params;
    const productFiltred = await listaItemsMongo.getById(productId)
    if (productFiltred) {
        res.status(200).json ({
            message: `Producto con id Nro ${productId}`,
            response: productFiltred
        })
    } else {
        res.status(404).send (`Lo sentimos, no contamos productos con ese id, 
        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda `)
    }
});

// Añadir productos nuevos.
productsRouter.post ("/products",verificarRol, async (req, res) => {
    const newProductPost = req.body;
    await listaItemsMongo.save(newProductPost)
    res.status(200).json ({
        message: `Producto creado`,
        response: newProductPost
    })
    // res.redirect("/")
}) 


// Modificar productos existentes.
productsRouter.put ("/products/:productId",verificarRol, async (req, res) => {
    const {productId} = req.params;
    const modification = req.body;
    const prodUpdated = await listaItemsMongo.updateById((productId), modification);
    res.status(200).json ({
        message: `El producto con Id Nro ${productId} fue modificado`,
        response: prodUpdated
    })
})

// Eliminar productos. 
productsRouter.delete ("/products/:productId",verificarRol, async (req, res) => {
    const {productId} = req.params;
    const newarray = await listaItemsMongo.deleteById(productId)
    if (newarray) {
    res.status(200).json ({
        message: `Lista de productos actualizada, el id eliminado fue el Nro ${productId}`,
        response: newarray
    })
    } else {
        res.status(404).send (`El producto con el ID Nro ${productId} no se encuentra`)
    }
})

export default productsRouter;