import express  from "express";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as localStrategy } from "passport-local";

const productsRouter = express.Router ();

import {contenedorDaoProducts} from "../daos/indexDaos.js";
const listaItems = contenedorDaoProducts;

import {productsMock} from "../mocks/productMock.js";
import { usersModel } from "../models/user.js";
const productTest = new productsMock();

// Function para verificar Loggin al servidor y las rutas de productos. 
const verificarlogin = (req,res,next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect ("/login")
    }
}

// Logica relacionada a la autenticación e inicio de la sesión: 
// -----------------------------

// Conectamos a la base de datos: 
const mongoUrl = "mongodb+srv://coderEcommerce:desafio@cluster0.cawm4qi.mongodb.net/usersDB?retryWrites=true&w=majority";

mongoose.connect(mongoUrl,{
    useNewUrlParser: true,
    useUnifiedTopology:true
},(error)=>{
    if(error) return console.log(`Hubo un error conectandose a la base ${error}`);
    console.log("conexion a la base de datos de manera exitosa")
});

// Configuración de passport
productsRouter.use (passport.initialize()); // Conectar passport con express,
productsRouter.use (passport.session()) // Vincular passport con las sessions de los usuarios

// Serializar y deserializar usuarios
passport.serializeUser ((user,done) => {
    done (null, user.id)
})

passport.deserializeUser (async (id, done) => {
    // Validar si usuario existe en MongoDB
    usersModel.findById (id, (error, userFound) => {
        if (error) return done (error);
        return done (null, userFound)
    })
})

// Estrategia de registro usando passport -Local.
passport.use ("localStrategy", new localStrategy (
    {
        passReqToCallback: true,
        usernameField: "email",
    },
    (req, username, password, done) => {
        //Logica para registrar al usuario
        // Verificar si usuario existe en la DB
        usersModel.findOne ({username: username}, (error, userExist) => {
            if (error) 
                return done (error, null, {message: "Hubo un error"});
            
            if (userExist) 
                return done ( null, null, {message: "El usuario ya existe"});

            // Si no se encontró al usuario, se procede a guardar en mongo DB
            const newUser= {
                user: req.body.user,
                username: username,
                password: password,
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

passport.use (new localStrategy(function (username, password, done) {
    usersModel.findOne ({username: username}, (error, wrongPass) => {
        
        if (error) return done (error);
        if (!wrongPass) return done (null, false, {message: "Email o contraseña incorrecta"})
    })
}));


//Logueo
productsRouter.get ("/registro", (req,res) => {
    res.render ("signup")
})

productsRouter.get ("/login", (req,res) => {
    res.render ("login")
});

productsRouter.get("/perfil", (req,res) => {
    if (req.isAuthenticated()) {
        res.render ("perfil")
    } else {
        res.send("<div> <h4> Debes </h4> <a href'/login'>inciar sesion </a> o <a href='/registro'>registrarte</a></div>")
    }
})

// Rutas de autenticación 
// ---------------- Login  
productsRouter.post ("/login", passport.authenticate ("localStrategy", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
}), (req,res) => {
    res.redirect ("/")
})

/*     (req,res) => {
    const {user} = req.body;
    if (user) {
        req.session.username = user
        res.redirect("/")
    } else {
     res.render ("login")
    }
}); */

// ------------------ Registro usando passport - LocalStrategy
productsRouter.post ("/registro", passport.authenticate("localStrategy", {
    failureRedirect: "/registro",
    failureMessage: true, // Envio de mensajes de error por medio de req.session.messages
 }), (req,res) => {
    res.redirect ("/")
})

// Logout de la sesión. 
productsRouter.get ("/logout", (req,res) => {
    req.session.destroy();
    res.redirect("login")
})

// Inicial
productsRouter.get ("/", async (req,res) => {
    const allProducts = await listaItems.getAll()
    res.status(200).render ("home", {
        user: req.session.username,
        allProducts: allProducts
    })
})

//Obtener todos los productos guardados
productsRouter.get ("/allproducts",verificarlogin, async (req, res) => {
    const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).render ("allproducts", {
            allProducts: allProducts
        })
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})
/*     const allProducts = await listaItems.getAll()
    if (allProducts) {
        res.status(200).send(allProducts)
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
}) */

// Busqueda de producto por ID. 
productsRouter.get ("/allproducts/:productId",verificarlogin,async (req, res) => {
    const {productId} = req.params;
    const productFiltred = await listaItems.getById(productId)
    if (productFiltred) {
        res.status(200).json ({
            message: `Producto con id Nro ${productId}`,
            response: productFiltred
        })
    } else {
        res.status(404).send (`Lo sentimos, no contamos productos con ese id, 
        te invitamos a revisar nuestro catalogo completo para modificar tu busqueda `)
    }
});

// Añadir productos nuevos.
productsRouter.post ("/products", async (req, res) => {
    const newProductPost = req.body;
    await listaItems.save(newProductPost)
    res.status(200).json ({
        message: `Producto creado`,
        response: newProductPost
    })
    // res.redirect("/")
}) 


// Modificar productos existentes.
productsRouter.put ("/products/:productId", async (req, res) => {
    const {productId} = req.params;
    const modification = req.body;
    const prodUpdated = await listaItems.updateById((productId), modification);
    res.status(200).json ({
        message: `El producto con Id Nro ${productId} fue modificado`,
        response: prodUpdated
    })
});

// Eliminar productos. 
productsRouter.delete ("/products/:productId", async (req, res) => {
    const {productId} = req.params;
    const newarray = await listaItems.deleteById(productId)
    if (newarray) {
    res.status(200).json ({
        message: `Lista de productos actualizada, el id eliminado fue el Nro ${productId}`,
        response: newarray
    })
    } else {
        res.status(404).send (`El producto con el ID Nro ${productId} no se encuentra`)
    }
});

//Generar productos fake
productsRouter.post ("/generar-productos", async (req,res) => {
    const results =  productTest.populate(5)
    res.send (results)
});

productsRouter.get ("/productos-test", (req, res) => {
    const fakeproducts = productTest.getAll()
    res.send (fakeproducts)
})

export default productsRouter;
