import { contenedorDaoCarts } from "../model/indexDaos.js";

export const getAllCarritos = async () => {
    return await contenedorDaoCarts.getAllCarritos()
}

export const crearCarrito = async () => {
    return await contenedorDaoCarts.crearCarrito()
}

export const deleteAllCarrito = async (carritoId) => {
    return await contenedorDaoCarts.deleteById (carritoId)
}

export const getById = async (carritoId) => {
    return await contenedorDaoCarts.getById(carritoId)
}

export const anadirProducto = async (carritoId,productId) => {
    return await contenedorDaoCarts.anadirProducto(carritoId,productId)
}

export const deleteProductsCarrito = async (carritoId,productId) => {
    return await contenedorDaoCarts.deleteProducto (carritoId, productId)
}