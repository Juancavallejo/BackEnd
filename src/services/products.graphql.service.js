import { contenedorDaoProducts } from "../model/indexDaos.js";

export const root = {
    getAllProducts: async () => {
        return await contenedorDaoProducts.getAll()
    },
    getById: async () => {
        return await contenedorDaoProducts.getById(productId)
    },
    saveProduct: async () => {
        return await contenedorDaoProducts.save(newProductPost)
    },
    modificateProduct: async() => {
        return await contenedorDaoProducts.updateById((productId),modification)
    },
    deleteProduct: async() => {
        return await contenedorDaoProducts.deleteById(productId)
    }
}