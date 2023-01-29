import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { usersModel } from "../../persistence/models/user.js";
import { config } from "../../options/config.js";
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

// Estrategia de Login usando passport - Google
const google_client_id = config.GOOGLE_ID_CLIENT;
const google_client_secret = config.GOOGLE_CLIENT_SECRET;
const PORT = config.PORT

export const google = () => {
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
}




