import { contenedorDaoProducts } from "../model/indexDaos.js";
import {productsMock} from "./mocks/productMock.js";
const productTest = new productsMock();



export const getAllProductsHome = async () => {
    return await contenedorDaoProducts.getAll()
};

export const getById = async (productId) => {
    return await contenedorDaoProducts.getById(productId)
}

export const saveProduct = async (newProductPost) => {
    return await contenedorDaoProducts.save(newProductPost)
}

export const modificateProduct = async (productId, modification) => {
    return await contenedorDaoProducts.updateById((productId),modification)
}

export const deleteProduct = async (productId) => {
    return await contenedorDaoProducts.deleteById(productId)
}

export const generarProductsFake = async () => {
    return await productTest.populate(5)
}

export const getFakeProducts = async () => {
    return await productTest.getAll()
}


