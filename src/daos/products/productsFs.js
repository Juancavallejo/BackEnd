import Contenedor from "../../Contenedores/ClassProductsFs.js";

//Subclase productos FileSystem
class productsDaoFs extends Contenedor {
    constructor (nameFile){
        // ejecuta el constructor de la clase Contenedor de FileSystem
        super(nameFile);
    }
}

export {productsDaoFs}