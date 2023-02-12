import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { usersModel } from "../../model/dbModels/user.js";
import bcrypt from "bcrypt";
import { connectDB } from "../../options/DbConfig.js";


// Conectamos a la base de datos de Mongo: 
connectDB();

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
export const signupLocal = () => {
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
}

// Estrategia de Login usando passport -Local.
export const loginLocal = () => {
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
}



