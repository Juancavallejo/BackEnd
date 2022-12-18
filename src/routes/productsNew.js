"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _indexDaos = require("../daos/indexDaos.js");

var _productMock = require("../mocks/productMock.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var productsRouter = _express2.default.Router();

var listaItems = _indexDaos.contenedorDaoProducts;

var productTest = new _productMock.productsMock();

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

// Inicial
productsRouter.get("/", checkAuthentication, function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var user, allProducts;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        user = req.user.user;
                        _context.next = 3;
                        return listaItems.getAll();

                    case 3:
                        allProducts = _context.sent;

                        res.status(200).render("home", {
                            user: user,
                            allProducts: allProducts
                        });

                    case 5:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

//Obtener todos los productos guardados
productsRouter.get("/allproducts", checkAuthentication, function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var allProducts;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return listaItems.getAll();

                    case 2:
                        allProducts = _context2.sent;

                        if (allProducts) {
                            res.status(200).render("allproducts", {
                                allProducts: allProducts
                            });
                        } else {
                            res.status(404).send("Lo sentimos, no hay productos para mostrar");
                        }

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());
/*     const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).send(allProducts)
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
}) */

// Busqueda de producto por ID. 
productsRouter.get("/allproducts/:productId", function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var productId, productFiltred;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        productId = req.params.productId;
                        _context3.next = 3;
                        return listaItems.getById(productId);

                    case 3:
                        productFiltred = _context3.sent;

                        if (productFiltred) {
                            res.status(200).json({
                                message: "Producto con id Nro " + productId,
                                response: productFiltred
                            });
                        } else {
                            res.status(404).send("Lo sentimos, no contamos productos con ese id, \n        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda ");
                        }

                    case 5:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

// Añadir productos nuevos.
productsRouter.post("/products", function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
        var newProductPost;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        newProductPost = req.body;
                        _context4.next = 3;
                        return listaItems.save(newProductPost);

                    case 3:
                        res.status(200).json({
                            message: "Producto creado",
                            response: newProductPost
                        });
                        // res.redirect("/")

                    case 4:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x7, _x8) {
        return _ref4.apply(this, arguments);
    };
}());

// Modificar productos existentes.
productsRouter.put("/products/:productId", function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
        var productId, modification, prodUpdated;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        productId = req.params.productId;
                        modification = req.body;
                        _context5.next = 4;
                        return listaItems.updateById(productId, modification);

                    case 4:
                        prodUpdated = _context5.sent;

                        res.status(200).json({
                            message: "El producto con Id Nro " + productId + " fue modificado",
                            response: prodUpdated
                        });

                    case 6:
                    case "end":
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x9, _x10) {
        return _ref5.apply(this, arguments);
    };
}());

// Eliminar productos. 
productsRouter.delete("/products/:productId", function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
        var productId, newarray;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        productId = req.params.productId;
                        _context6.next = 3;
                        return listaItems.deleteById(productId);

                    case 3:
                        newarray = _context6.sent;

                        if (newarray) {
                            res.status(200).json({
                                message: "Lista de productos actualizada, el id eliminado fue el Nro " + productId,
                                response: newarray
                            });
                        } else {
                            res.status(404).send("El producto con el ID Nro " + productId + " no se encuentra");
                        }

                    case 5:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x11, _x12) {
        return _ref6.apply(this, arguments);
    };
}());

//Generar productos fake
productsRouter.post("/generar-productos", function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res) {
        var results;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        results = productTest.populate(5);

                        res.send(results);

                    case 2:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x13, _x14) {
        return _ref7.apply(this, arguments);
    };
}());

productsRouter.get("/productos-test", function (req, res) {
    var fakeproducts = productTest.getAll();
    res.send(fakeproducts);
});

exports.default = productsRouter;
