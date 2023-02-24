import { getAllCarritos, crearCarrito, deleteAllCarrito,getById,anadirProducto,deleteProductsCarrito } from "../services/carrito.service.js";

export const getAllCarritosController = async (req,res) =>{
    try {
        const allCarritos = await getAllCarritos()
        if (allCarritos) {
            res.status(200).render ("allcarritos", {
                allCarritos: allCarritos
            })
        }    
    } catch (error) {
        res.status(404).send (`Lo sentimos, no hay carritos para mostrar`)
    }
}

export const crearCarritoController = async (req,res) => {
    try {
        const newCarrito = await crearCarrito()
        res.status(200).json (`Carrito creado con Id Nro ${newCarrito.id} y con fecha ${newCarrito.timestamp}`)
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const deleteAllCarritoController = async (req,res) => {
    try {
        const {carritoId} = req.params;
        const carritoDeleted = await deleteAllCarrito(carritoId)
        res.status(200).json ({
            message: `El Carrito con Id Nro ${carritoId} ha sido eliminado, nueva lista de carritos:`,
            response: carritoDeleted
        })
    
    } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const getByIdController = async (req,res) => {
    try {
        const {carritoId} = req.params;
        const carritoFiltred = await getById(carritoId)
        res.status(200).json ({
            message: `El Carrito con Id Nro ${carritoId} tiene los siguientes productos`,
            response: carritoFiltred
        }) 
        } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const anadirProductoController = async (req,res) => {
    try {
        const {carritoId, productId} = req.params;
        await anadirProducto(carritoId, productId);
        const carritoFinal = await getById(carritoId)
        res.status(200).json ({
            message: `Al Carrito con Id Nro ${carritoId} se le ha añadido el producto con Id Nro. ${productId} `,
            response: carritoFinal
        }) 
        } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}

export const deleteProductsCarritoController = async (req,res) => {
    try {
        const {carritoId, productId} = req.params;
        await deleteProductsCarrito (carritoId, productId)
        const carritoFinal = await getById(carritoId)
        res.status(200).json ({
            message: `Al Carrito con Id Nro ${carritoId} se le ha eliminado el producto con Id Nro. ${productId} `,
            response: carritoFinal
        }) 
        } catch (error) {
        res.status(400).json({message:`Hubo un error ${error}`})
    }
}


