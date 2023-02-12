import mongoose from "mongoose";
import { optionsMongo } from "../../options/DbConfig.js";

//Logica para conectarse. 
mongoose.connect(optionsMongo.mongoUrl, {
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