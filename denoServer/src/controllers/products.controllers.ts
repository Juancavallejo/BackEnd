import { Context, helpers, MongoClient, config} from "../../depts.ts"
import { Products } from "../models/dbModels/products.ts"

const {MONGO_URL} = config()

const client = new MongoClient();
try {
    await client.connect(MONGO_URL);
    console.log ("Conexión exitosa a la base de datos")
} catch (error) {
    console.log (`Hubo un error al conectar a la base de datos ${error}`)
}

const db = client.database("items")
const productModel = db.collection("products")

export const findProductAll = async (ctx: Context) => {
    try {
        const products = await productModel.find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {data: products}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = {message: `Hubo un error ${error.message}`} // res.json
    }
}

export const  findProductById = async (ctx:Context) => {
    try {
        const {id} = helpers.getQuery(ctx,{mergeParams:true});//req.params;
        const products = await productModel.findOne({_id: new ObjectId(id)});
        ctx.response.status = 200;
        ctx.response.body = {data:products}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = {message: `Hubo un error ${error.message}`} // res.json
    }
}

export const createProduct = async (ctx: Context) => {
    try {
        const body = await ctx.request.body().value; // Req.body
        await productModel.insertOne (body);
        ctx.response.status = 200
        ctx.response.body = {data: "User created"}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = {message: `Hubo un error ${error.message}`} // res.json
    }
}
