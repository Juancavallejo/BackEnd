import path from "path";
import {fileURLToPath} from 'url';
import { claveFirebase } from "../../options/DbConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import admin from "firebase-admin"


const serviceAccount = claveFirebase

// Inicializamos firebase.
admin.initializeApp({credential: admin.credential.cert(serviceAccount),
    databaseURL:"https://coder-backend-72349.firebaseio.com",
});
console.log ("Base conectada - Firebase");

// Generar instancia de la base de datos.
const db = admin.firestore();
//Definir la collection
const productsCollection = db.collection("products");

class ContenedorProductosFirebase {
    constructor (collectionName) {
        this.collectionName = collectionName
    }

    save = async (newProductPost) => {
        await db.collection(this.collectionName).doc().create(newProductPost);

    }

    getAll = async () => {
        const {docs} = await db.collection(this.collectionName).get();
        const products = docs.map (doc => ({
            id: doc.id,
            ...doc.data()       
        }))
        return products
    }

    getById = async (productId) => {
        const doc = await db.collection(this.collectionName).doc(productId)
        const item = await doc.get()
        const productos = item.data()
        return productos
    }

    updateById = async (productId,modification) => {
        await db.collection(this.collectionName).doc(productId).update(modification)
        const prodUpdated = await this.getById(productId)
        return (prodUpdated)
    }

    deleteById = async (productId) => {
        await db.collection(this.collectionName).doc(productId).delete()
        const newarray = await this.getAll()
        return (newarray)
    }
}

export default ContenedorProductosFirebase
