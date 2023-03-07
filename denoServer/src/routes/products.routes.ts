import { Router } from "../../depts.ts";
import {findProductAll, findProductById, createProduct} from "../controllers/products.controllers.ts"
import { Products} from "../models/dbModels/products.ts"

export const productRouter = new Router()
    .get("/products",findProductAll)
    .get("/products/:id", findProductById)
    .post("/products", createProduct)