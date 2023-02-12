import * as dotenv from "dotenv";
import parsedArgs from "minimist";


dotenv.config();  // Asign las variales del archivo .env a process.env

// Configuración de la aplicación 

// Llama librería minimist y definir variables defaul
const options = {default: {puerto:8080, modo: "fork"}}

const objArguments = parsedArgs(process.argv.slice(2), options)


export const config = {
    MODO: objArguments.modo,
    PORT: process.env.PORT || 8080,
    GOOGLE_ID_CLIENT: process.env.GOOGLE_ID_CLIENT,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CLAVE_MONGODB: process.env.CLAVE_MONGODB,
    ACCOUNTID: process.env.ACCOUNTID,
    AUTHTOKEN: process.env.AUTHTOKEN,
    dbType: process.env.DATABASE_TYPE || "archivos"
}