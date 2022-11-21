import CarritoMongo from "../../Contenedores/Carritos/ClassCarritoMongodb.js";

// Subclase carritos Mongo
class cartsMongo extends CarritoMongo {
    constructor (carritoName) {
        //ejecuta el constructor de la clase carrito de Mongo
        super(carritoName)
    }
}

export {cartsMongo}