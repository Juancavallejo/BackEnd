import mongoose from "mongoose";

// Se define la collection de productos -> DB items
const mensajesCollection = "mensajes";

// Se define el schema de los productos  _> DB items
const mensajesSchema = new mongoose.Schema ({

    userEmail: {
        type:String,
        required:true
    },

    message: {
        type:String,
        required:true
    }
});

//Generar el modelo 
export const mensajesModel = mongoose.model(mensajesCollection,mensajesSchema);
