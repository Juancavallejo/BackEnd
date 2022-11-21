import ContenedorMock from "../Contenedores/ClassMock.js";
import {faker} from "@faker-js/faker";
const {datatype, commerce, random, image} = faker;

//Subclase productos Mock
class productsMock extends ContenedorMock {
    constructor (){
        // ejecuta el constructor de la clase Contenedor de los Mocks
        super();
    }

    populate (qty) {
        let newproducts = [];

        for (let i=0; i<qty; i++) {
            newproducts.push (
                {
                    id: datatype.uuid(),
                    title: commerce.product(),
                    codigo: random.numeric(2),
                    stock: random.numeric(2),
                    price: commerce.price (100,5000,0),
                    thumbnail:image.cats(640,480),
                    description: commerce.productDescription(),
                }
            )
        }

        this.products = [...this.products,...newproducts]
        return newproducts
    }

}

export {productsMock}