import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import { usersModel } from "../models/user.js";
import bcrypt from "bcrypt";
import { config } from "../options/config.js";

import {createTransport} from "nodemailer"


const loginRouter = express.Router();

// Serializar y deserializar usuarios
passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    // Validar si usuario existe en MongoDB
    usersModel.findById(id, (error, userFound) => {
        if (error) return done(error);
        return done(null, userFound)
    })
})

// Crear funcion para encriptar la contraseña
const createHast = (password) => {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    return hash;
}

// Estrategia de registro usando passport -Local.
passport.use("localRegistry", new localStrategy(
    {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password",
        
    },
    (req, username, password,done) => {
        //Logica para registrar al usuario
        // Verificar si usuario existe en la DB
        usersModel.findOne({ username: username }, (error, userExist) => {
            if (error)
                return done(error, null, { message: "Hubo un error" });

            if (userExist)
                return done(null, null, {
                    message: `Lo sentimos, este correo electronico ya existe, por favor
                verifiquelo`});

            // Si no se encontró al usuario, se procede a guardar en mongo DB
            const newUser = {
                user: req.body.user,
                username: username,
                password: createHast(password),
                address: req.body.address,
                phone: req.body.phone,
                age: req.body.age
            };
            usersModel.create(newUser, (error, userCreated) => {
                if (error)
                    return done(error, null, { message: "Hubo un error" });

                if (userCreated)
                    return done(null, userCreated)
            })
        })
    }
))

// Estrategia de Login usando passport -Local.
passport.use("localLogin", new localStrategy(
    {
        passReqToCallback: true,
        usernameField: "email",
        passwordField: "password"
    },
    (req, username, password, done) => {
        usersModel.findOne({ username }, (error, userExist) => {
            if (error)
                return done(error, null, { message: "Hubo un error" });

            if (!userExist)
                return done(null, false, { message: "Este usuario no se encuentra, registrado. Por favor, cree una cuenta." })

            if (userExist) {
                if (!bcrypt.compareSync(password, userExist.password)) {
                    return done(null, false, { message: "Contraseña o correo electronico erroneo" })
                }
            }
            if (userExist) {
                if (bcrypt.compareSync(password, userExist.password)) {
                    return done(null, userExist)
                }
            }
        })
    }
))

// Estrategia de Login usando passport - Google
const google_client_id = config.GOOGLE_ID_CLIENT;
const google_client_secret = config.GOOGLE_CLIENT_SECRET;
const PORT = config.PORT

passport.use(new GoogleStrategy({
    clientID: google_client_id,
    clientSecret: google_client_secret,
    callbackURL: `http://localhost:${PORT}/google/callback`,
},
    (token, accesToken, profile, done) => {
        usersModel.findOne({ username: profile.username }, (error, userFound) => {
            if (error) return done(error, null, { message: "Hubo un error" });
            if (userFound) return done(null, userFound);
            //guardamos el usuario en la db
            const newUser = {
                user: profile._json.email,
                username: profile.displayName,
                password: profile.id
            };
            usersModel.create(newUser, (error, userCreated) => {
                if (error) return done(error, null, { message: "Hubo un error al registrar el usuario" })
                return done(null, userCreated);
            })
        })
    }
));


// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Conectamos a la base de datos: 
const mongoUrl = `mongodb+srv://coderEcommerce:${config.CLAVE_MONGODB}@cluster0.cawm4qi.mongodb.net/items?retryWrites=true&w=majority`;

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error) => {
    if (error) return console.log(`Hubo un error conectandose a la base ${error}`);
    //console.log("conexion a la base de datos users de manera exitosa")
});


// Rutas de autenticación 
// ------------------ Login usando passport - Google.

loginRouter.get("/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

loginRouter.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true,
}), (req, res) => {
    res.redirect("/")
});


// ------------------ Registro usando passport - LocalStrategy
// Configuración del transporter - Email
const testEmail = "juancamilovallejo@gmail.com";
const testPass = 'jeyhyoaaqcjtahnm'

const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: testEmail,
        pass: testPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false,
    }
});




loginRouter.get("/registro", (req, res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", { error: errorMessage })
    req.session.messages = []
})

loginRouter.post("/registro", passport.authenticate("localRegistry", {
    failureRedirect: "/registro",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true
}), async (req, res) => {
    try {
        const mailOptions = {
            from: "Servidor de NodeJs",
            to: testEmail,
            subject: "Nuevo registro",
            html: `<div>
                    <h1>Se ha registrado un nuevo usuario</h1>
                    <p>Con los siguientes datos nombre:${req.user.user},email:${req.user.email},direccion:${req.user.address},numero de telefono: ${req.user.phone}</p> 
                    </div>
                    `,
        }
    await transporter.sendMail(mailOptions)
    res.redirect("/")
    } catch (error) {
        res.send (error)
    }
})

// ---------------- Login usando passport - LocalStrategy & Google. 
loginRouter.get("/login", (req, res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("login", { error: errorMessage })
    req.session.messages = []
});

loginRouter.post("/login", passport.authenticate("localLogin", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true,
}), (req, res) => {
    res.redirect("/")
})

// ---------- Ruta perfil 
loginRouter.get("/perfil", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("perfil", {
            user: req.user.user,
            address: req.user.address,
            phone: req.user.phone,
        })
        console.log (req.user)
    } else {
        res.render("login")
    }
})



// -------------- Logout de la sesión. 
loginRouter.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("login")
})

export default loginRouter;