import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import {usersModel} from "../models/user.js";
import bcrypt from "bcrypt"; 

const loginRouter = express.Router ();

// Serializar y deserializar usuarios
passport.serializeUser ((user,done) => {
    done (null, user.id);
})

passport.deserializeUser ((id, done) => {
    // Validar si usuario existe en MongoDB
     usersModel.findById (id, (error, userFound) => {
        if (error) return done (error);
        return done (null, userFound)
    })
})

// Crear funcion para encriptar la contraseña
const createHast = (password) => {
    const hash = bcrypt.hashSync(password,bcrypt.genSaltSync(10))
    return hash;
}

// Estrategia de registro usando passport -Local.
passport.use ("localRegistry", new localStrategy (
    {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password"
    },
    (req, username, password, done) => {
        //Logica para registrar al usuario
        // Verificar si usuario existe en la DB
        usersModel.findOne ({username: username}, (error, userExist) => {
            if (error) 
                return done (error, null, {message: "Hubo un error"});
            
            if (userExist) 
                return done ( null, null, {message: `Lo sentimos, este correo electronico ya existe, por favor
                verifiquelo`});

            // Si no se encontró al usuario, se procede a guardar en mongo DB
            const newUser= {
                user: req.body.user,
                username: username,
                password: createHast(password),
            };
            usersModel.create (newUser, (error, userCreated) => {
                if (error)
                    return done (error, null, {message: "Hubo un error"});
                
                if (userCreated)
                    return done (null, userCreated)
            })
        })
    }
))

// Estrategia de Login usando passport -Local.
passport.use ("localLogin", new localStrategy (
    {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password"
    },
    (req, username, password, done) => {
        usersModel.findOne ({username}, (error, userExist) => {
        if (error) 
        return done (error, null, {message: "Hubo un error"}); 
        
        if (!userExist)
        return done (null, false, {message: "Este usuario no se encuentra, registrado. Por favor, cree una cuenta."})
        
        if (userExist) {
            if (!bcrypt.compareSync(password, userExist.password)) {
                return done (null, false, {message: "Contraseña o correo electronico erroneo"})
            }
        }
        if (userExist) {
            if (bcrypt.compareSync(password, userExist.password)) {
                return done (null, userExist)
            }
        }
        })
    }
))


// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Conectamos a la base de datos: 
const mongoUrl = "mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/items?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(error)=>{
    if(error) return console.log(`Hubo un error conectandose a la base ${error}`);
    console.log("conexion a la base de datos de manera exitosa")
});


// Rutas de autenticación 
// ------------------ Registro usando passport - LocalStrategy
loginRouter.get ("/registro", (req,res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render ("signup", {error: errorMessage})
    req.session.messages = []
})

loginRouter.post ("/registro", passport.authenticate("localRegistry", {
    failureRedirect: "/registro",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true
}), (req,res) => {
    res.redirect ("/")
})

// ---------------- Login usando passport - LocalStrategy 
loginRouter.get ("/login", (req,res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render ("login", {error: errorMessage})
    req.session.messages = []
});

loginRouter.post ("/login", passport.authenticate ("localLogin", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true,
}), (req,res) => {
    res.redirect ("/")
})

// ---------- Ruta perfil 
loginRouter.get("/perfil", (req,res) => {
    const user = req.user.user
    if (req.isAuthenticated()) {
        res.render ("perfil", {
            user:user,
        })
    } else {
        res.render ("login")
    }
})



// -------------- Logout de la sesión. 
loginRouter.get ("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("login")
})

export default loginRouter;