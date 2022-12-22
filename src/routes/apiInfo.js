import express from "express";
import os from "os";
import { config } from "../options/config.js";

const apiRouter = express.Router();

let argumentosEntrada = process.argv
let pathEjecucion = process.execPath
let sistemaOperativo = process.platform
let processId = process.pid
let nodeVersion = process.version
let carpetaProyecto = process.cwd()
let usoMemoria = process.memoryUsage();
export let numeroCPUs = os.cpus().length
const PORT = config.PORT

apiRouter.get ("/info", (req,res) => {
    res.json ({
        message: `Respuesta desde el puerto ${PORT} en el proceso ${process.pid}`,
        response: 
            argumentosEntrada,
            pathEjecucion,
            processId,
            sistemaOperativo,
            nodeVersion,
            carpetaProyecto,
            usoMemoria,
            numeroCPUs,
    })
})

let arrayAleatorio = []
const numeroAleatorios = (qty) => {
for (let i = 0; i <qty; i++) {
    const numeroAleatorio = (Math.ceil((Math.random()*1000)))
    arrayAleatorio.push(numeroAleatorio)
/*     if (arrayAleatorio [numeroAleatorio]) {
        arrayAleatorio [numeroAleatorio] ++
    } else {
        arrayAleatorio [numeroAleatorio] = 1;
    } */
}
// console.table (arrayAleatorio)
return arrayAleatorio
}

apiRouter.get ("/random", (req,res) => {
    const {qty} = req.query
    if (qty >= 0) {
    const results = numeroAleatorios(parseInt(qty))
    arrayAleatorio = []
    res.json (results)
    } else {
    const results = numeroAleatorios(100000000)
    arrayAleatorio = []
    res.json (results)
    }
})

export default apiRouter;