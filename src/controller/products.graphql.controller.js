import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import { root } from "../services/products.graphql.service.js";

// Configuración del Schema 
const graphqlSchema = buildSchema (`
    type products {
        id: String,
        title: String,
        codigo: String,
        thumbnail: String,
        stock: String,
        price: String
    }

    input productsInput {
        title: String,
        price: String,
        thumbnail: String,
    }

    type Query {
        getAllProducts: [products],
        getProductById (id : String) : products
    }

    type Mutation {
        addProduct (product: productsInput) : products,
        deleteProductById (id: String) : String

    }
`);

export const productsGraphqlController = () => {
    return graphqlHTTP({
        schema:graphqlSchema,
        rootValue: root,
        graphiql: true
    })
};