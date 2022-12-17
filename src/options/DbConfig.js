import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Options config Firebase Key
export const claveFirebase = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri:process.env.TOKEN_URI,
    auth_provider_x509_cert_url:process.env.AUTO_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
}

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