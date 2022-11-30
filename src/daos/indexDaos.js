//Import de los modelos de MongoDB
import { productModel } from "../models/products.js";
import { carritoModel } from "../models/carrito.js";

let contenedorDaoProducts;
let contenedorDaoCarts;

// Identificador:

let databaseType = "archivos";

switch (databaseType) {
    case "archivos": 
        const {productsDaoFs}= await import("./products/productsFs.js") 
        const {cartsDaoFs} = await import ("./carts/cartsFs.js")   
        contenedorDaoProducts = new productsDaoFs("productos.txt")
        contenedorDaoCarts = new cartsDaoFs("carrito.txt")
        break;
    case "mongodb":
        const {productsDaoMongo} = await import("./products/productsMongo.js")
        const {cartsMongo} = await import("./carts/cartsMongo.js")
        contenedorDaoProducts = new productsDaoMongo(productModel)
        contenedorDaoCarts = new cartsMongo(carritoModel)
        break;
    case "firebase":
        const {productsDaoFirebase} = await import ("./products/productsFirebase.js")
        contenedorDaoProducts = new productsDaoFirebase("products")
        break;
    case "sql":
        const {productsDaoSql} = await import("./products/productsSql.js")
        contenedorDaoProducts = new productsDaoSql("products")
        break;
}

export {contenedorDaoProducts, contenedorDaoCarts}