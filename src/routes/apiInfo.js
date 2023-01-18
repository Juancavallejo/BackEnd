import express from "express";
import os from "os";
import { config } from "../options/config.js";
import compression from "compression";
import { numeroAleatorios } from "./child.js";
import { fork } from "child_process";

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
const MODO = config.MODO

apiRouter.get ("/info", (req,res) => {
    res.json ({
        message: `Respuesta desde el puerto ${PORT}, modo ${MODO} en el proceso ${process.pid}`,
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

apiRouter.get ("/infoCompressed", compression(), (req,res) => {
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

// let arrayAleatorio = []
// const numeroAleatorios = (qty) => {
//     for (let i = 0; i <qty; i++) {
//         const numeroAleatorio = (Math.ceil((Math.random()*1000)))
//         arrayAleatorio.push(numeroAleatorio)
//         /*     if (arrayAleatorio [numeroAleatorio]) {
//             arrayAleatorio [numeroAleatorio] ++
//         } else {
//             arrayAleatorio [numeroAleatorio] = 1;
//         } */
//     }
//     return arrayAleatorio
// }
let arrayAleatorio = []

// Ruta bloqueante, numeros aleatorios
apiRouter.get ("/randombloq", (req,res) => {
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

//Ruta no bloqueante, numeros aleatorios
/* apiRouter.get ("/random", (req,res) => {
    const child = fork("src/routes/child.js");
    //recibimos mensajes del proceso hijo
    child.on("message",(childMsg)=>{
        if(childMsg === "listo"){
            //recibimos notificacion del proceso hijo, y le mandamos un mensaje para que comience a operar.
            child.send("Iniciar")
        } else {
            res.json({resultado:childMsg})
        }
    });
});
 */
export default apiRouter;