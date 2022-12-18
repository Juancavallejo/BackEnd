"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require("passport-local");

var _passportGoogleOauth = require("passport-google-oauth20");

var _passportGoogleOauth2 = _interopRequireDefault(_passportGoogleOauth);

var _user = require("../models/user.js");

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _config = require("../options/config.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loginRouter = _express2.default.Router();

// Serializar y deserializar usuarios
_passport2.default.serializeUser(function (user, done) {
    done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
    // Validar si usuario existe en MongoDB
    _user.usersModel.findById(id, function (error, userFound) {
        if (error) return done(error);
        return done(null, userFound);
    });
});

// Crear funcion para encriptar la contraseña
var createHast = function createHast(password) {
    var hash = _bcrypt2.default.hashSync(password, _bcrypt2.default.genSaltSync(10));
    return hash;
};

// Estrategia de registro usando passport -Local.
_passport2.default.use("localRegistry", new _passportLocal.Strategy({
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "password"
}, function (req, username, password, done) {
    //Logica para registrar al usuario
    // Verificar si usuario existe en la DB
    _user.usersModel.findOne({ username: username }, function (error, userExist) {
        if (error) return done(error, null, { message: "Hubo un error" });

        if (userExist) return done(null, null, {
            message: "Lo sentimos, este correo electronico ya existe, por favor\n                verifiquelo" });

        // Si no se encontró al usuario, se procede a guardar en mongo DB
        var newUser = {
            user: req.body.user,
            username: username,
            password: createHast(password)
        };
        _user.usersModel.create(newUser, function (error, userCreated) {
            if (error) return done(error, null, { message: "Hubo un error" });

            if (userCreated) return done(null, userCreated);
        });
    });
}));

// Estrategia de Login usando passport -Local.
_passport2.default.use("localLogin", new _passportLocal.Strategy({
    passReqToCallback: true,
    usernameField: "email",
    passwordField: "password"
}, function (req, username, password, done) {
    _user.usersModel.findOne({ username: username }, function (error, userExist) {
        if (error) return done(error, null, { message: "Hubo un error" });

        if (!userExist) return done(null, false, { message: "Este usuario no se encuentra, registrado. Por favor, cree una cuenta." });

        if (userExist) {
            if (!_bcrypt2.default.compareSync(password, userExist.password)) {
                return done(null, false, { message: "Contraseña o correo electronico erroneo" });
            }
        }
        if (userExist) {
            if (_bcrypt2.default.compareSync(password, userExist.password)) {
                return done(null, userExist);
            }
        }
    });
}));

// Estrategia de Login usando passport - Google
var google_client_id = _config.config.GOOGLE_ID_CLIENT;
var google_client_secret = _config.config.GOOGLE_CLIENT_SECRET;

_passport2.default.use(new _passportGoogleOauth2.default({
    clientID: google_client_id,
    clientSecret: google_client_secret,
    callbackURL: "http://localhost:8080/google/callback"
}, function (token, accesToken, profile, done) {
    _user.usersModel.findOne({ username: profile.username }, function (error, userFound) {
        if (error) return done(error, null, { message: "Hubo un error" });
        if (userFound) return done(null, userFound);
        //guardamos el usuario en la db
        var newUser = {
            user: profile._json.email,
            username: profile.displayName,
            password: profile.id
        };
        _user.usersModel.create(newUser, function (error, userCreated) {
            if (error) return done(error, null, { message: "Hubo un error al registrar el usuario" });
            return done(null, userCreated);
        });
    });
}));

// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Conectamos a la base de datos: 
var mongoUrl = "mongodb+srv://coderEcommerce:" + _config.config.CLAVE_MONGODB + "@cluster0.cawm4qi.mongodb.net/items?retryWrites=true&w=majority";

_mongoose2.default.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error) {
    if (error) return console.log("Hubo un error conectandose a la base " + error);
    //console.log("conexion a la base de datos users de manera exitosa")
});

// Rutas de autenticación 
// ------------------ Login usando passport - Google.

loginRouter.get("/auth/google", _passport2.default.authenticate("google", { scope: ["email", "profile"] }));

loginRouter.get("/google/callback", _passport2.default.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true
}), function (req, res) {
    res.redirect("/");
});

// ------------------ Registro usando passport - LocalStrategy
loginRouter.get("/registro", function (req, res) {
    var errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", { error: errorMessage });
    req.session.messages = [];
});

loginRouter.post("/registro", _passport2.default.authenticate("localRegistry", {
    failureRedirect: "/registro",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true
}), function (req, res) {
    res.redirect("/");
});

// ---------------- Login usando passport - LocalStrategy & Google. 
loginRouter.get("/login", function (req, res) {
    var errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("login", { error: errorMessage });
    req.session.messages = [];
});

loginRouter.post("/login", _passport2.default.authenticate("localLogin", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true
}), function (req, res) {
    res.redirect("/");
});

// ---------- Ruta perfil 
loginRouter.get("/perfil", function (req, res) {
    if (req.isAuthenticated()) {
        res.render("perfil", {
            user: req.user.user
        });
    } else {
        res.render("login");
    }
});

// -------------- Logout de la sesión. 
loginRouter.get("/logout", function (req, res) {
    req.session.destroy();
    res.redirect("login");
});

exports.default = loginRouter;
