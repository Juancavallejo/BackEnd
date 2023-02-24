import express  from "express";
import * as productsController from "../../controller/products.controller.js"

const router = express.Router ();


function checkAuthentication (req,res,next) {
    if (req.isAuthenticated()) {
        next ()
    } else {
        res.redirect ("/login")
    }
}

// Home
router.get ("/", checkAuthentication, productsController.getAllProductsHomeController)

//Obtener todos los productos guardados
router.get ("/allproducts", productsController.getAllProductsController)

// Busqueda de producto por ID. 
router.get ("/allproducts/:productId",productsController.getByIdController)

// Añadir productos nuevos.
router.post ("/products", productsController.saveProductController)

// Modificar productos existentes.
router.put ("/products/:productId", productsController.modificateProductController)

// Eliminar productos. 
router.delete ("/products/:productId", productsController.deleteProductController)

//Generar productos fake
router.post ("/generar-productos", productsController.generarProductsFakeController)

router.get ("/productos-test", productsController.getFakeProductsController)



export { router as productsRouter}
