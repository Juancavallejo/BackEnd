"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.numeroCPUs = undefined;

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _os = require("os");

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiRouter = _express2.default.Router();

var argumentosEntrada = process.argv;
var pathEjecucion = process.execPath;
var sistemaOperativo = process.platform;
var processId = process.pid;
var nodeVersion = process.version;
var carpetaProyecto = process.cwd();
var usoMemoria = process.memoryUsage();
var numeroCPUs = exports.numeroCPUs = _os2.default.cpus().length;

apiRouter.get("/info", function (req, res) {
    res.json({
        argumentosEntrada: argumentosEntrada,
        pathEjecucion: pathEjecucion,
        processId: processId,
        sistemaOperativo: sistemaOperativo,
        nodeVersion: nodeVersion,
        carpetaProyecto: carpetaProyecto,
        usoMemoria: usoMemoria,
        numeroCPUs: numeroCPUs
    });
});

var arrayAleatorio = [];
var numeroAleatorios = function numeroAleatorios(qty) {
    for (var i = 0; i < qty; i++) {
        var numeroAleatorio = Math.ceil(Math.random() * 1000);
        arrayAleatorio.push(numeroAleatorio);
    }
    return arrayAleatorio;
};

apiRouter.get("/random", function (req, res) {
    var qty = req.query.qty;

    if (qty >= 0) {
        var results = numeroAleatorios(parseInt(qty));
        arrayAleatorio = [];
        res.json(results);
    } else {
        var _results = numeroAleatorios(100000000);
        arrayAleatorio = [];
        res.json(_results);
    }
});

exports.default = apiRouter;
