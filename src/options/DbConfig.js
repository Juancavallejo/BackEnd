import path from "path";
import {fileURLToPath} from 'url';
/* import mongoose from "mongoose";

// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Conectamos a la base de datos: 
const mongoUrl = "mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/usersDB?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(error)=>{
    if(error) return console.log(`Hubo un error conectandose a la base ${error}`);
    console.log("conexion a la base de datos de manera exitosa")
}); */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Options config Sqlite

export const options = {
    client: "sqlite",
    connection: {
        filename: path.join(__dirname, "../database/ecommerceChat.sqlite")
    },
}


// Options configuracion mySql

export const optionsProducts = {
    //Con que gestor de base de datos me voy a conectar
    client:"mysql",
    //Toda la información de la base de datos para conectarnos
    connection:{
       host: "127.0.0.1",
       user: "root",
       password:"",
       database: "ecommerceProducts" 
    }
}