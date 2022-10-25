const express = require ("express");
const productsRouter = express.Router ();

const Contenedor = require ("../ClassContenedor")
const listaItems = new Contenedor ("productos.txt")

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
    const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).json ({
            message: "Lista de productos",
            response: allProducts
        })
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})

// Busqueda de producto por ID. 

productsRouter.get ("/allproducts/:productId", async (req, res) => {
    const allProductos = await listaItems.getAll();
    const {productId} = req.params;
    const productFiltred = allProductos.find (el => el.id === parseInt(productId))
    if (productFiltred) {
        res.status(200).json ({
            message: `Producto con id Nro ${productId}`,
            response: productFiltred
        })
    } else {
        res.status(404).send (`Lo sentimons, no contamos productos con ese id, 
        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda `)
    }
});

// Añadir productos nuevos.

productsRouter.post ("/products",verificarRol, async (req, res) => {
    const newProductPost = req.body;
    await listaItems.save(newProductPost)
    res.status(200).json ({
        message: "Producto creado",
        response: newProductPost
    })
    // res.redirect("/")
}) 


// Modificar productos existentes.

productsRouter.put ("/:productId",verificarRol, async (req, res) => {
    const {productId} = req.params;
    const modification = req.body;
    const prodUpdated = await listaItems.updateById (parseInt (productId), modification);
    res.status(200).json ({
        message: "Producto modificado",
        response: prodUpdated
    })
})

// Eliminar productos. 

productsRouter.delete ("/:productId",verificarRol, async (req, res) => {
    const allProductos = await listaItems.getAll();
    const {productId} = req.params;
    const newarray = allProductos.filter ( el => el.id !== parseInt(productId)) 
    if (newarray) {
    await listaItems.deleteById(productId)
    res.status(200).json ({
        message: `Lista de productos actualizada, el id eliminado fue el Nro ${productId}`,
        response: newarray
    })
    } else {
        res.status(404).send ("El producto con el ID solicitado no se encuentra")
    }
})


module.exports = productsRouter;