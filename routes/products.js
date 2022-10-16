const express = require ("express");
const productsRouter = express.Router ();

const Contenedor = require ("../ClassContenedor")
const listaItems = new Contenedor ("productos.txt")

productsRouter.get ("/", async (req,res) => {
    res.status(200).render ("home")
})

productsRouter.get ("/products", async (req, res) => {
    const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).render ("products", {
            allProducts: allProducts
        })
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})

//Obtener todos los productos guardados

productsRouter.get ("./partials/products", async (req, res) => {
    const allProducts = await listaItems.getAll()
    res.render ("products", {
        allProducts: allProducts
    })
})

// Busqueda de producto por ID. 

productsRouter.get ("/:productId", async (req, res) => {
    const allProductos = await listaItems.getAll();
    const {productId} = req.params;
    const productFiltred = allProductos.find (el => el.id === parseInt(productId))
    if (productFiltred) {
        res.status(200).send (productFiltred) 
    } else {
        res.status(404).send (`Lo sentimons, no contamos productos con ese id, 
        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda `)
    }
    
});

// Añadir productos nuevos.

productsRouter.post ("/products", async (req, res) => {
    const newProductPost = req.body;
    await listaItems.save (newProductPost)
    // const allProductos = await listaItems.getAll();
    res.redirect("/")
})

// Modificar productos existentes.

productsRouter.put ("/:productId", async (req, res) => {
    const {productId} = req.params;
    const modification = req.body;
    const prodUpdated = await listaItems.updateById (parseInt (productId), modification);
    res.status(200).send (prodUpdated)
})

// Eliminar productos. 

productsRouter.delete ("/:productId", async (req, res) => {
    const allProductos = await listaItems.getAll();
    const {productId} = req.params;
    const newarray = allProductos.filter ( el => el.id !== parseInt(productId)) 
    if (newarray) {
    await listaItems.deleteById(productId)
    res.status(200).send (newarray)
    } else {
        res.status(404).send ("El producto con el ID solicitado no se encuentra")
    }
})


module.exports = productsRouter;