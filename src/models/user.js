import mongoose from "mongoose";


// Se define la collection de usuarios -> DB usuarios
const usersCollection = "users";

// Se define el schema de los usuarios -> DB usuarios
const usersSchema = new mongoose.Schema ({
    user: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});



// Generar el modelo

export const usersModel = mongoose.model (usersCollection, usersSchema);