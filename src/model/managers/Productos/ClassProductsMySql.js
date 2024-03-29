
import { optionsProducts } from "../../../options/DbConfig.js"
import knex from "knex";

const database = knex(optionsProducts)

// Contenedor de productos realizado con logica de mysql. Los parametros de conexión se encuentran en
// la carpera options/mysqlconfig.js

class ContenedorProductosMysql {
    constructor (tablename) {
        this.tablename = tablename
    }

    // Metodo para crear una base de datos inicial junto con el script.
    crearTabla = async() => {
    const tableExist = await database.schema.hasTable(this.tablename);
    if (tableExist) {
        await database.schema.dropTable(this.tablename);
    } 
    await database.schema.createTable(this.tablename, table => {
        table.increments("id");
        table.string("codigo", 10).nullable(false);
        table.integer("stock");
        table.string("title", 15).nullable(false);
        table.float("price");
        table.string("thumbnail");      
    });

    }

    // Metodos para manejar los productos. El uso de los metodos se puede ver en la route products

    save = async(newProductPost) => {
        await database(this.tablename).insert(newProductPost)
    }

    getAll = async() => {
        const data= await database(this.tablename).select ("*");
        const newData = data.map (elm => ({...elm}));
        return (newData)
    }

    getById = async (productId) => {
        const productFiltred = database.from(this.tablename).select("*").where("id", productId)
        return productFiltred
    }   

    updateById = async (productId, modification) => {
       await database(this.tablename).where("id", productId).update(modification)
       const productUpdated = await this.getById(productId)
       return productUpdated
    }

    deleteById = async (productId) => {
        await database(this.tablename).where("id", productId).del()
        const newData = await this.getAll()
        return newData
    }
}

export default ContenedorProductosMysql


// Script para llenar de información la base de datos, toda vez que al estar alojada en un pc de forma local,
// Cada que se descarga el archivo se tendría que volver a llenar la info.

const productosArray = [
    {codigo: "Camisa", stock: 10, title: "Camisa",price: 120, thumbnail: "https://i.linio.com/p/840df4d6729305b627e843508bc810e7-product.webp"},
    {codigo: "jean", stock: 10, title: "jean", price: 580, thumbnail: "https://i.linio.com/p/49481c8b2b89accad291a7fa60e78f37-product.webp"},
    {codigo: "Chaqueta", stock: 10, title: "Chaqueta", price: 900, thumbnail: "https://i.linio.com/p/8236764ab90c934f336074f530ed2e24-catalog.webp"},
    {codigo: "Jogger", stock: 10,title: "Jogger", price: 2300, thumbnail: "https://i.linio.com/p/6b87342cce8ace2fe49f5d4199a41e45-product.webp"},
    {codigo: "Gorra", stock: 10, title: "Gorra", price: 2870, thumbnail: "https://i.linio.com/p/1c3be0ecef49802a9a9a394c892df896-product.webp"},
    {codigo: "falda", stock: 10, title: "falda", price: 3420, thumbnail: "https://i.linio.com/p/bf5688435f04ba971dbd51e4ef27a612-product.webp"},
    {codigo: "vestido",stock: 10,title: "vestido",price: 4520, thumbnail: "https://i.linio.com/p/4001ba795846bd7062fcfea5a12df915-product.webp"},
    {codigo: "bolso", stock: 10, title: "bolso", price: 4999, thumbnail: "https://i.linio.com/p/a81640db73aa9bb9d4730e4a2be0c7f3-product.webp"},
    {codigo: "Zapato", stock: 10, title: "Zapato", price: 1450, thumbnail: "https://i.linio.com/p/1f2303ca340a5870d5e1123be6efb8f6-product.webp"},
    {codigo:"Reloj", stock: 10, title: "Reloj", price: 3780, thumbnail: "https://i.linio.com/p/7cc5c1757938d4f8e871d67c57ccb25d-product.webp"},
    {codigo: 11, stock: 10, title: "Gafas de sol verdes", price: 1890, thumbnail: "https://i.linio.com/p/7ea60a4a0773bc7acf4085056096c447-product.webp"}
    
]

const listaItems = new ContenedorProductosMysql ("products")
await listaItems.crearTabla();
await listaItems.save(productosArray);
