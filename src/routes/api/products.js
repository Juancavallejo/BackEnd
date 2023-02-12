import express  from "express";

const router = express.Router ();

import {contenedorDaoProducts} from "../../model/indexDaos.js";
const listaItems = contenedorDaoProducts;

import {productsMock} from "../../services/mocks/productMock.js";
const productTest = new productsMock();

function checkAuthentication (req,res,next) {
    if (req.isAuthenticated()) {
        next ()
    } else {
        res.redirect ("/login")
    }
}

// Inicial
router.get ("/",checkAuthentication, async (req,res) => {
    const user = req.user.user
    const allProducts = await listaItems.getAll()
    res.status(200).render ("home", {
        user: user,
        allProducts: allProducts
    })
})

//Obtener todos los productos guardados
router.get ("/allproducts",checkAuthentication, async (req, res) => {
    const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).render ("allproducts", {
            allProducts: allProducts
        })
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})
/*     const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).send(allProducts)
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
}) */

// Busqueda de producto por ID. 
router.get ("/allproducts/:productId",async (req, res) => {
    const {productId} = req.params;
    const productFiltred = await listaItems.getById(productId)
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
router.post ("/products", async (req, res) => {
    const newProductPost = req.body;
    await listaItems.save(newProductPost)
    res.status(200).json ({
        message: `Producto creado`,
        response: newProductPost
    })
    // res.redirect("/")
}) 


// Modificar productos existentes.
router.put ("/products/:productId", async (req, res) => {
    const {productId} = req.params;
    const modification = req.body;
    const prodUpdated = await listaItems.updateById((productId), modification);
    res.status(200).json ({
        message: `El producto con Id Nro ${productId} fue modificado`,
        response: prodUpdated
    })
});

// Eliminar productos. 
router.delete ("/products/:productId", async (req, res) => {
    const {productId} = req.params;
    const newarray = await listaItems.deleteById(productId)
    if (newarray) {
    res.status(200).json ({
        message: `Lista de productos actualizada, el id eliminado fue el Nro ${productId}`,
        response: newarray
    })
    } else {
        res.status(404).send (`El producto con el ID Nro ${productId} no se encuentra`)
    }
});

//Generar productos fake
router.post ("/generar-productos", async (req,res) => {
    const results =  productTest.populate(5)
    res.send (results)
});

router.get ("/productos-test", (req, res) => {
    const fakeproducts = productTest.getAll()
    res.send (fakeproducts)
})


export { router as productsRouter}
