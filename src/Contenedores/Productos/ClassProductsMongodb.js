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
        
})

class ContenedorProductosMongo {
    constructor (baseName) {
        this.baseName = baseName;
        
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

    updateById = async (productId,modification) => {
        const data = await(this.baseName).updateOne({"codigo":productId},{$set:modification})
        const newProduct = await this.getById(productId)
        return newProduct
    } 

    deleteById = async (productId) => {
        await (this.baseName).deleteOne ({"codigo":productId})
        const data = this.getAll()
        return data
    }

}

export default ContenedorProductosMongo
