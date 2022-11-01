import { options } from "./options/sqlConfig.js";
import knex from "knex";

const database = knex(options);

const historialMensajes = [
    {userEmail:"libro", message:"728xd"},

];

class ContenedorMensajesSql {
    constructor (tablename) {
        this.tablename = tablename
    }
    
    crearTabla = async() => {
        await database.schema.createTable(this.tablename, table => {
            table.string("userEmail");
            table.string("message");
        })
    }

    save = async(data) => {
       if (data) {
           await database(this.tablename).insert(data)
       }
    }

    getAll = async () => {
        const data = await database(this.tablename).select("*");
        const newData = data.map (elm => ({...elm}))
        console.log (newData)
        return newData
    }
}

const listaMensajes = new ContenedorMensajesSql ("mensajes")
/* await listaMensajes.crearTabla(); */


export default ContenedorMensajesSql;