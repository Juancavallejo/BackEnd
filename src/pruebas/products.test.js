import supertest from "supertest";
import { expect } from "chai";
import { app } from "../server.js";

const request = supertest(app);

// Pruebas endpoints de los usuarios
describe("api products test", ()=> {
    it("get allproducts",async () => {
        const response = await request.get ("/allproducts");
        expect(response.status).equal(200)
        expect(response.body).to.eql({})

        
    });
    it("Post new product",async () => {
        const response = await request.post ("/products").send({
            "title": "titulo de prueba",
            "price": 320,
            "thumbnail": "https://i.linio.com/p/7ea60a4a0773bc7acf4085056096c447-product.webp",
              
        });
        expect(response.status).equal(200)
        expect (response.body.message).equal ("Producto creado")
    }); 
    it("Delete",async () => {
        const responseDel = await request.delete(`/products/:productId`) 
        expect(responseDel.status).equal(200)
        expect (responseDel.body.message).equal ("Lista de productos actualizada, el id eliminado fue el Nro :productId")
    }); 
})