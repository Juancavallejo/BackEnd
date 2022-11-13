import { options } from "../options/sqlConfig.js";
import knex from "knex";

const database = knex(options);

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
       await database(this.tablename).insert(data)

    }

    getAll = async () => {
        const data = await database(this.tablename).select("*");
        const newData = data.map (elm => ({...elm}))
        return newData
    }
}

const historialMensajes = [
    {userEmail:"juanca@gmail.com", message:"Hola"},
    {userEmail:"juanca@gmail.com", message:"Como estas?"},
    {userEmail:"juanca@gmail.com", message:"Espero que bien"},
    {userEmail:"juanca@gmail.com", message:"Que tengas feliz dia!"}

];

/* const listaMensajes = new ContenedorMensajesSql ("mensajes")
await listaMensajes.crearTabla();
await listaMensajes.save(historialMensajes) */


export default ContenedorMensajesSql;