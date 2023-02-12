import log4js from "log4js";
import { config } from "../../options/config.js";

//configuracion de log4js
log4js.configure({
    appenders:{
        //definir las salidas de datos
        consola:{type:"console"},
        archivoWarnings: {type:"file", filename:"./src/services/loggers/warn.log"},
        archivoErrors: {type:"file", filename:"./src/services/loggers/error.log"},
        //salidas con niveles definidos
        loggerConsola: {type:"logLevelFilter", appender:'consola', level:'info'},
        loggerWarning: {type:"logLevelFilter", appender:'archivoWarnings', level:'warn'},
        loggerError: {type:"logLevelFilter", appender:'archivoErrors', level:'Error'},
    },
    categories:{
        default:{appenders:['loggerConsola',"loggerWarning", "loggerError" ], level:'all'},
        produccion:{appenders:['loggerError','loggerWarning'], level:'all'}
    }
});

let MODO = config.MODO
let logger

if(MODO === "prod"){
    logger = log4js.getLogger("produccion");
} else {
    logger = log4js.getLogger()
};

export {logger};