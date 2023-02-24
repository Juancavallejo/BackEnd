import express from "express";
import { transporter, testEmail } from "../../services/messages/gmail.js";
import { client } from "../../services/messages/twilio.js";
import * as carritoControler from "../../controller/carritos.controller.js"

import {contenedorDaoCarts} from "../../model/indexDaos.js"
const carrito = contenedorDaoCarts;

const router = express.Router ();
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
router.get ("/allcarritos", carritoControler.getAllCarritosController)


// Crear carrito y devuelve id
router.post ("/", verificarRol,carritoControler.crearCarritoController)

// Delete all carrito
router.delete ("/delete/:carritoId",verificarRol, carritoControler.deleteAllCarritoController)


//Buscar carrito por Id y mostrar todos los productos
router.get ("/allcarritos/:carritoId", carritoControler.getByIdController)

// Incorporar productos al carrito
router.post ("/:carritoId/:productId",verificarRol,carritoControler.anadirProductoController)


// Delete productos del carrito
router.delete ("/:carritoId/:productId", verificarRol, carritoControler.deleteProductsCarritoController)

router.get("/generarCompra", async(req,res) => {
    const user = req.user.user;
    const email = req.user.username;
    const address = req.user.address;
    const phone = req.user.phone;
    const allproducts = await carrito.getAllProducts()
    const mailOptions = {
        from: "Servidor de NodeJs",
        to: testEmail,
        subject: "Order de compra generada",
        html: `Pedido en proceso para el usuario de nombre ${user} con email ${email} y a la direccion ${address},esta persona ha comprado los siguientes productos:${allproducts}`,
    }
    try {
        // Envio de mensaje de whatsapp de confirmación de compra al administrador.
        await transporter.sendMail(mailOptions)
        // Envio de mensaje de whatsapp de confirmación de compra al administrador.
        await client.messages.create({
            body:`Pedido en proceso para el usuario de nombre ${user} con email ${email} y a la direccion ${address},esta persona ha comprado los siguientes productos:${allproducts}`,
            from: `whatsapp:+14155238886`, //Emisor del mensaje
            to:`whatsapp:+573122829659`
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
        console.log (error)
    }
})


export { router as carritoRouter}
