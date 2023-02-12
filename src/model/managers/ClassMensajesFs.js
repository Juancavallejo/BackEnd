import fs from "fs"
import path from "path";
import {fileURLToPath} from 'url';
import {normalize,schema,denormalize} from "normalizr"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



class mensajes {
    constructor (historial) {
        this.historial = path.join(__dirname,"../../", `public/${historial}`)
    }

    save = async(data) => {
        const contenido = await fs.promises.readFile(this.historial,"utf-8")
        const mensajes = JSON.parse(contenido)
        const newMensaje = {
            ...data
        }
        mensajes.push(newMensaje)
        await fs.promises.writeFile(this.historial, JSON.stringify(mensajes, null, 2));
    }

    getAll = async () => {
        try {
            // Se lee el historial de mensajes
            const data = await fs.promises.readFile(this.historial, "utf-8");
            const newData = JSON.parse (data);
            // Inicia el proceso de normalización:
            // creación de esquemas
            const autorSchema = new schema.Entity("authors", {}, {idAttribute:"userEmail"})
            const messageSchema = new schema.Entity("messages", {author: autorSchema})
            const chatSchema = new schema.Entity ("chat", {
                message: [messageSchema]
            }, {idAttribute:"id"});
            // Aplica la normalización: 
            const normalizedData = normalize({id: "historial", messages:newData}, chatSchema)
            return normalizedData
        } catch (error) {
            return []
        }
    }
}

export default mensajes