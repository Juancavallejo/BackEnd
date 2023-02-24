//Import de los modelos de MongoDB
import { productModel } from "./dbModels/products.js";
import { carritoModel } from "./dbModels/carrito.js";
import { config } from "../options/config.js"

const dbType = config.dbType


export async function getApiDao (dbType) {

}
let contenedorDaoProducts;
let contenedorDaoCarts;
switch (dbType) {
    case "archivos": 
        const {productsDaoFs}= await import("./daos/products/productsFs.js") 
        const {cartsDaoFs} = await import ("./daos/carts/cartsFs.js")   
        contenedorDaoProducts = new productsDaoFs("productos.txt")
        contenedorDaoCarts = new cartsDaoFs("carrito.txt")
        break;
    case "mongodb":
        const {productsDaoMongo} = await import("./daos/products/productsMongo.js")
        const {cartsMongo} = await import("./daos/carts/cartsMongo.js")
        contenedorDaoProducts = new productsDaoMongo(productModel)
        contenedorDaoCarts = new cartsMongo(carritoModel)
        break;
    case "firebase":
        const {productsDaoFirebase} = await import ("./daos/products/productsFirebase.js")
        contenedorDaoProducts = new productsDaoFirebase("products")
        break;
    case "sql":
        const {productsDaoSql} = await import("./daos/products/productsSql.js")
        contenedorDaoProducts = new productsDaoSql("products")
        break;
}

export {contenedorDaoProducts, contenedorDaoCarts}