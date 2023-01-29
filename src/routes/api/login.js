import express from "express";
import passport from "passport";
import { transporter, testEmail } from "../../services/messages/gmail.js";
import { loginLocal,signupLocal } from "../../services/passport/local-auth.js";
import { google } from "../../services/passport/auth-google.js";

const router = express.Router();

// Estrategia de registro usando passport -Local.
signupLocal()

// Estrategia de Login usando passport -Local.
loginLocal()

// Estrategia de Login usando passport - Google
google()

// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Rutas de autenticación 
// ------------------ Login usando passport - Google.

router.get("/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true,
}), (req, res) => {
    res.redirect("/")
});


// ------------------ Registro usando passport - LocalStrategy
router.get("/registro", (req, res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("signup", { error: errorMessage })
    req.session.messages = []
})

router.post("/registro", passport.authenticate("localRegistry", {
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
router.get("/login", (req, res) => {
    const errorMessage = req.session.messages ? req.session.messages[0] : '';
    res.render("login", { error: errorMessage })
    req.session.messages = []
});

router.post("/login", passport.authenticate("localLogin", {
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
    passReqToCallback: true,
}), (req, res) => {
    res.redirect("/")
})

// ---------- Ruta perfil 
router.get("/perfil", (req, res) => {
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
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("login")
})


export { router as loginRouter}