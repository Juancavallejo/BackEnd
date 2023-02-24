import { getAllProductsHome, getById, saveProduct,deleteProduct,modificateProduct,getFakeProducts, generarProductsFake } from "../services/products.service.js";

export const getAllProductsHomeController = async (req,res) => {
    try {
        const user = req.user.user
        const allProducts = await getAllProductsHome();
        res.status(200).render ("home", {
            user: user,
            allProducts: allProducts
        })   
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const getAllProductsController = async (req,res) => {
    try {
        const allProducts = await getAllProductsHome()
        res.status(200).render ("allproducts", {
            allProducts: allProducts
        })  
        } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const getByIdController = async (req,res) => {
    try {
    const {productId} = req.params;
    const productFiltred = await getById(productId)
    if (productFiltred) {
        res.status(200).json ({
            message: `Producto con id Nro ${productId}`,
            response: productFiltred
        })
    }
    } catch (error) {
        res.status(404).send (`Lo sentimos, no contamos productos con ese id, 
        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda `)
    }
}

export const saveProductController = async (req,res) => {
    try {
        const newProductPost = req.body;
        await saveProduct(newProductPost)
        res.status(200).json ({
            message: `Producto creado`,
            response: newProductPost
        })    
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const modificateProductController = async (req,res) => {
    try {
        const {productId} = req.params;
        const modification = req.body;
        const prodUpdated = await modificateProduct((productId), modification);
        res.status(200).json ({
            message: `El producto con Id Nro ${productId} fue modificado`,
            response: prodUpdated
        })    
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const deleteProductController = async (req,res) => {
    try {
        const {productId} = req.params;
        const newarray = await deleteProduct(productId)
        if (newarray) {
            res.status(200).json ({
                message: `Lista de productos actualizada, el id eliminado fue el Nro ${productId}`,
                response: newarray
            })
        }
    } catch (error) {
    res.status(404).send (`El producto con el ID Nro ${productId} no se encuentra`)
    }
}

export const generarProductsFakeController = async (req,res) => {
    const results =  generarProductsFake()
    res.send (results)
}

export const getFakeProductsController = async (req,res) => {
    try {
        const fakeproducts = getFakeProducts()
        res.send (fakeproducts)
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}