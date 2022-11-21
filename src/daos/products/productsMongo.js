import ContenedorProductosMongo from "../../Contenedores/Productos/ClassProductsMongodb.js"

//Subclase productos Mongodb
class productsDaoMongo extends ContenedorProductosMongo {
    constructor (baseName){
        // ejecuta el constructor de la clase Contenedor de Mongodb
        super(baseName);
    }
}

export {productsDaoMongo}