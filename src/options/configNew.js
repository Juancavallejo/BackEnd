"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.config = undefined;

var _dotenv = require("dotenv");

var dotenv = _interopRequireWildcard(_dotenv);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

dotenv.config(); // Asign las variales del archivo .env a process.env

// Configuración de la aplicación 

// Llama librería minimist y definir variables defaul
var options = { default: { puerto: 8080, modo: "fork" } };

var objArguments = (0, _minimist2.default)(process.argv.slice(2), options);

var config = exports.config = {
    MODO: objArguments.modo,
    PORT: objArguments.puerto,
    GOOGLE_ID_CLIENT: process.env.GOOGLE_ID_CLIENT,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CLAVE_MONGODB: process.env.CLAVE_MONGODB
};
