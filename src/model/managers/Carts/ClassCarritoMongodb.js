import { connectDB } from "../../../options/DbConfig.js";

//Logica del contenedor de productos para ser usada en los metodos de anadir producto y deleteProducto
import { productModel } from "../../dbModels/products.js";

import ContenedorProductosMongo from "../Productos/ClassProductsMongodb.js";

                    
//Logica para conectarse. 
connectDB()

class CarritoMongo {
    constructor (carritoName) {
        this.carritoName = carritoName
    }
    
    // Metodos para manejar los carritos. El uso de los metodos se puede ver en la route carrito
    
    getAllCarritos = async() => {
        const data = await (this.carritoName).find();
        return data
    }
    
    crearCarrito = async() => {
        const data = await (this.carritoName).count()
        const newCarrito = {
        codigo: data + 1,
        "timestamp": new Date(),
        products: []    
        }
        const result = await (this.carritoName).create(newCarrito)
        return result
    }

    getById = async (carritoId) => {
        const data = await (this.carritoName).find({"codigo":carritoId})
        return data
    }
    
    deleteById = async (id) => {
        await (this.carritoName).deleteOne ({"codigo":id})
        const data = this.getAllCarritos()
        return data
    }

    anadirProducto = async (carritoId, productId) => {
        // Se trae el contenedor de productos para filtrar por producto.
        const listaItemsMongo = new ContenedorProductosMongo(productModel)
        // Se filtra el producto acorde al Id ingresado por req.params
        const productFiltred = await listaItemsMongo.getById(productId)
        //Se ingresa el producto escogido al carrito seleccionado.
        await (this.carritoName).updateOne({"codigo":carritoId},{$push:{"products":productFiltred}})
        
    }

    deleteProducto = async (carritoId, productId) => {
        // Se trae el contenedor de productos para filtrar por producto.
        const listaItemsMongo = new ContenedorProductosMongo(productModel)
        // Se filtra el producto acorde al Id ingresado por req.params
        const productFiltred = await listaItemsMongo.getById(productId)
        // Se deletea el producto escodigo del carrito seleccionado. 
        await (this.carritoName).updateOne({"codigo":carritoId},{$pull:{"products":productFiltred}})
    }
}

export default CarritoMongo





