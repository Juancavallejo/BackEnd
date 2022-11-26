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

class ContenedorMensajes {
    constructor (historial) {
        this.historial = historial
    }
    
    save = async(data) => {
        await (this.historial).create(data)
    }

    getAll = async() => {
        const data = await (this.historial).find();
        console.log (JSON.stringify(data))
        return data
    }
}

export default ContenedorMensajes;