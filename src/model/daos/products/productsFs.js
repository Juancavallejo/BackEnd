import ContenedorFs from "../../managers/Productos/ClassProductsFs.js"

//Subclase productos FileSystem
class productsDaoFs extends ContenedorFs {
    constructor (nameFile){
        // ejecuta el constructor de la clase Contenedor de FileSystem
        super(nameFile);
    }
}

export {productsDaoFs}