import { optionsProducts } from "./options/mysqlconfig.js";
import knex from "knex";

const database = knex(optionsProducts)

class ContenedorProductos {
    constructor (tablename) {
        this.tablename = tablename
    }

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

    save = async(newProductPost) => {
        await database(this.tablename).insert(newProductPost)
    }

    getAll = async() => {
        const data= await database(this.tablename).select ("*");
        const newData = data.map (elm => ({...elm}));
        return (newData)
    }

    getbyId = async (productId) => {
        const productFiltred = database.from(this.tablename).select("*").where("id", productId)
        return productFiltred
    }   

    updateById = async (productId, modification) => {
       await database(this.tablename).where("id", productId).update(modification)
       const productUpdated = await this.getbyId(productId)
       return productUpdated
    }

    deleteById = async (productId) => {
        await database(this.tablename).where("id", productId).del()
        const newData = await this.getAll()
        return newData
    }
}

const productosArray = [
    {codigo: "Camisa", stock: 10, title: "Camisa",price: 300, thumbnail: "https://i.linio.com/p/840df4d6729305b627e843508bc810e7-product.webp"},
    {codigo: "jean", stock: 10, title: "jean", price: 350, thumbnail: "https://i.linio.com/p/49481c8b2b89accad291a7fa60e78f37-product.webp"},
    {codigo: "Chaqueta", stock: 10, title: "Chaqueta", price: 700, thumbnail: "https://i.linio.com/p/8236764ab90c934f336074f530ed2e24-catalog.webp"}
]

const listaItems = new ContenedorProductos ("products")
// await listaItems.crearTabla();
// await listaItems.save(productosArray);

export default ContenedorProductos