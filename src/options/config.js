import * as dotenv from "dotenv";
import parsedArgs from "minimist";

dotenv.config();  // Asign las variales del archivo .env a process.env

// Configuración de la aplicación 

// Llama librería minimist y definir variables defaul
const options = {default: {puerto:8080}}

const objArguments = parsedArgs(process.argv.slice(2), options)
// console.log (objArguments.puerto)

export const config = {
    PORT: objArguments.puerto,
    GOOGLE_ID_CLIENT: process.env.GOOGLE_ID_CLIENT,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CLAVE_MONGODB: process.env.CLAVE_MONGODB
}