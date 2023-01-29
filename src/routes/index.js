import express from "express";
import { loginRouter } from "./api/login.js";
import { productsRouter } from "./api/products.js";
import { carritoRouter } from "./api/carrito.js";
import { infoRouter } from "./api/apiInfo.js";

const router = express.Router();

router.use ("/", loginRouter)
router.use ("/", productsRouter)
router.use ("/carrito",carritoRouter)
router.use ("/api", infoRouter)

export {router as apiRouter}