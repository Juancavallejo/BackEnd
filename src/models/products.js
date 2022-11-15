import mongoose from "mongoose";

// Se define la collection de productos -> DB items
const productsCollection = "products";

// Se define el schema de los productos  _> DB items
const productSchema = new mongoose.Schema ({

    title: {
        type:String,
        required:true
    },
    codigo: {
        type:Number,
        required:true,
        unique:true,
    },
    thumbnail: {
        type:String,
        required:true
    },
    stock: {
        type:Number,
        required:true
    },
    price: {
        type:Number,
        required:true
    },
});

//Generar el modelo 
export const productModel = mongoose.model(productsCollection,productSchema);