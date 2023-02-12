import express from "express"
import ContenedorUsersMongo from "../../model/managers/users/classUsersMongo.js";
import {usersModel} from "../../model/dbModels/user.js"

const listaUsers = new ContenedorUsersMongo(usersModel)

const router = express.Router();

//Obtener todos los usuarios guardados
router.get ("/allusers",async (req, res) => {
    const allusers = await listaUsers.getAll()
    if (allusers) {
        res.status(200).json(allusers)
    } else {
        res.status(404).send (`Lo sentimos, no hay productos para mostrar`)
    }
})

export {router as usersRouter}