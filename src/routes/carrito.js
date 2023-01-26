import express, { json }  from "express";
import {createTransport} from "nodemailer";
import twilio from "twilio";
const carritoRouter = express.Router ();

import {contenedorDaoCarts} from "../daos/indexDaos.js"
const carrito = contenedorDaoCarts;

// Function para verificar rol. Por el momento se encuentra en poder acceder a todas las rutas.
const verificarRol = (req,res,next) => {
    const rol = "client";
    if (rol === "client") {
        next();
    } else {
        res.send ("No tienes acceso a la ruta")
    }
}

//Obtener todos los productos guardados

carritoRouter.get ("/allcarritos", async (req, res) => {
    const allCarritos = await carrito.getAllCarritos()
    if (allCarritos) {
        res.status(200).render ("allcarritos", {
            allCarritos: allCarritos
        })
        // res.status(200).json ({
        //     message: "Lista de ordenes de compra",
        //     response: allCarritos
        // })
    } else {
        res.status(404).send (`Lo sentimos, no hay carritos para mostrar`)
    }
})

// Crear carrito y devuelve id
carritoRouter.post ("/", verificarRol,async (req, res) => {
    const newCarrito = await carrito.crearCarrito()
    res.status(200).json (`Carrito creado con Id Nro ${newCarrito.codigo} y con fecha ${newCarrito.timestamp}`)
})

// Delete all carrito
carritoRouter.delete ("/delete/:carritoId",verificarRol, async (req, res) => {
    const {carritoId} = req.params;
    const carritoDeleted = await carrito.deleteById(carritoId)
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} ha sido eliminado, nueva lista de carritos:`,
        response: carritoDeleted
    })
})

//Buscar carrito por Id y mostrar todos los productos
carritoRouter.get ("/allcarritos/:carritoId", async (req, res) => {
    const {carritoId} = req.params;
    const carritoFiltred = await carrito.getById(carritoId)
    res.status(200).json ({
        message: `El Carrito con Id Nro ${carritoId} tiene los siguientes productos`,
        response: carritoFiltred
    }) 
})

// Incorporar productos al carrito
carritoRouter.post ("/:carritoId/:productId",verificarRol, async (req, res) => {
    const {carritoId, productId} = req.params;
    await carrito.anadirProducto(carritoId, productId);
    const carritoFinal = await carrito.getById(carritoId)
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha añadido el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 
})

// Delete productos del carrito
carritoRouter.delete ("/:carritoId/:productId", verificarRol, async (req,res) => {
    const {carritoId, productId} = req.params;
    await carrito.deleteProducto (carritoId, productId)
    const carritoFinal = await carrito.getById(carritoId)
    res.status(200).json ({
        message: `Al Carrito con Id Nro ${carritoId} se le ha eliminado el producto con Id Nro. ${productId} `,
        response: carritoFinal
    }) 

})

// Guardar order de compra
const testEmail = "juancamilovallejo@gmail.com";
const testPass = 'jeyhyoaaqcjtahnm'

// Configuración del transporter - Gmail
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

const accountId = "AC5860ae9b886ed01b1bac2ce511275e9e";
const authToken = "c53bd29e4790d8b660539b8e60da58d6";

const client = twilio(accountId, authToken)

carritoRouter.get("/generarCompra", async(req,res) => {
    const user = req.user.user;
    const email = req.user.username;
    const address = req.user.address;
    const phone = req.user.phone;
    const allproducts = await carrito.getAllProducts()
    const mailOptions = {
        from: "Servidor de NodeJs",
        to: testEmail,
        subject: "Order de compra generada",
        html: `Pedido en proceso para el usuario de nombre ${user} con email ${email} y a la direccion ${address},
        esta persona ha comprado los siguientes productos:${allproducts}`,
    }
    try {
        // Envio de mensaje de whatsapp de confirmación de compra al administrador.
        await transporter.sendMail(mailOptions)
        // Envio de mensaje de whatsapp de confirmación de compra al administrador.
        await client.messages.create({
            body:`Pedido en proceso para el usuario de nombre ${user} con email ${email} y a la direccion ${address},
            esta persona ha comprado los siguientes productos:${allCarritos}`,
            from: "whatsapp:+14155238886", //Emisor del mensaje
            to:`whatsapp:${phone}`
        }) 
        // Envio de mensaje de texto de confirmación de compra al cliente.
        await client.messages.create({
            body:"Su pedido se ha recibido y está en proceso. Muchas gracias por su compra.",
            from: "+19253719982", //Emisor del mensaje
            to:`${phone}`
        })
        res.redirect ("/")
    } catch (error) {
        res.send (error)
    }
})

export default carritoRouter
