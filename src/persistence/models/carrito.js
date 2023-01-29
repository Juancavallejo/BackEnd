import mongoose from "mongoose";

// Se define la collection de productos -> DB carritos
const carritoCollection = "carritos"

// Se define el schema de los productos  _> DB carritos
const carritoSchema = new mongoose.Schema ({

    codigo: {
        type:Number,
        required:true,
        unique:true,
    },

    products: {
        type: Array,
    },
    timestamp: {
        type:String,
    }
})

// Generar el modelo
export const carritoModel = mongoose.model(carritoCollection,carritoSchema);
