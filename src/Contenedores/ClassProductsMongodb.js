import mongoose from "mongoose";

// URL para conectarse a mongodb Atlas y tener la DB en la nube.
const URL = "mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/items?retryWrites=true&w=majority"
                            //Nombre DB + password                             Nombre de la DB
//Logica para conectarse. 
mongoose.connect(URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
    }, error=>{
        if(error) throw new Error(`connection failed ${error}`);
        console.log("conexion a mongoDB-items exitosa")
})

/* const operacionesCRUD = async () => {
    const productosArray = [
        {codigo: 1, stock: 10, title: "Camisa",price: 120, thumbnail: "https://i.linio.com/p/840df4d6729305b627e843508bc810e7-product.webp"},
        {codigo: 2, stock: 10, title: "jean", price: 580, thumbnail: "https://i.linio.com/p/49481c8b2b89accad291a7fa60e78f37-product.webp"},
        {codigo: 3, stock: 10, title: "Chaqueta", price: 900, thumbnail: "https://i.linio.com/p/8236764ab90c934f336074f530ed2e24-catalog.webp"},
        {codigo: 4, stock: 10,title: "Jogger", price: 2300, thumbnail: "https://i.linio.com/p/6b87342cce8ace2fe49f5d4199a41e45-product.webp"},
        {codigo: 5, stock: 10, title: "Gorra", price: 2870, thumbnail: "https://i.linio.com/p/1c3be0ecef49802a9a9a394c892df896-product.webp"},
        {codigo: 6, stock: 10, title: "falda", price: 3420, thumbnail: "https://i.linio.com/p/bf5688435f04ba971dbd51e4ef27a612-product.webp"},
        {codigo: 7,stock: 10,title: "vestido",price: 4520, thumbnail: "https://i.linio.com/p/4001ba795846bd7062fcfea5a12df915-product.webp"},
        {codigo: 8, stock: 10, title: "bolso", price: 4999, thumbnail: "https://i.linio.com/p/a81640db73aa9bb9d4730e4a2be0c7f3-product.webp"},
        {codigo: 9, stock: 10, title: "Zapato", price: 1450, thumbnail: "https://i.linio.com/p/1f2303ca340a5870d5e1123be6efb8f6-product.webp"},
        {codigo:10, stock: 10, title: "Reloj", price: 3780, thumbnail: "https://i.linio.com/p/7cc5c1757938d4f8e871d67c57ccb25d-product.webp"},
        {codigo: 11, stock: 10, title: "Gafas de sol", price: 1890, thumbnail: "https://i.linio.com/p/7ea60a4a0773bc7acf4085056096c447-product.webp"} 
    ]

    let result = await productModel.insertMany(productosArray);
    console.log (result)
} */

class ContenedorProductosMongo {
    constructor (baseName) {
        this.baseName = baseName
    }

    // Metodos para manejar los productos. El uso de los metodos se puede ver en la route products
    save = async (newProductPost) => {
        await (this.baseName).create(newProductPost)
    }
    

    getAll = async () => {
       const data = await (this.baseName).find();
       return data
    }

    getById = async (productId) => {
        const data = await (this.baseName).find({"codigo":productId})
        return data
    }

/*     updateById = async (productId,modification) => {
        const data = await(this.baseName).updateOne({"codigo":productId},{set:modification})
    } */

    deleteById = async (productId) => {
        await (this.baseName).deleteOne ({"codigo":productId})
        const data = this.getAll()
        return data
    }
}

export default ContenedorProductosMongo
