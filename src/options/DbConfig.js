import path from "path";
import {fileURLToPath} from 'url';

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