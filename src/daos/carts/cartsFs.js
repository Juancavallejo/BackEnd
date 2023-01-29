import Carrito from "../../persistence/Contenedores/Carts/ClassCarrito.js";

//Subclase carritos FileSystem
class cartsDaoFs extends Carrito {
    constructor (filename){
        // ejecuta el constructor de la clase carrito de FileSystem
        super(filename);
    }
}

export {cartsDaoFs}