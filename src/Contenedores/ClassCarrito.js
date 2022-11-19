import fs from "fs"

class Carrito {
    constructor(nameFile) {
        this.nameFile = nameFile;
    }

    getAllCarritos = async () => {
        if (fs.existsSync("./public/carrito.txt")) {
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8");
            const newData = JSON.parse(data);
            return newData
        }
    }

    crearCarrito = async () => {
        if (fs.existsSync("./public/carrito.txt")) {
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8")
            const newData = JSON.parse(data)
            const newCarrito = {
                id: newData.length + 1,
                "timestamp": new Date(),
                products: []
            }
            newData.push(newCarrito)
            fs.promises.writeFile("./public/carrito.txt", JSON.stringify(newData, null, 2));
            return newCarrito
        } else {
            const newCarrito = {
                id: 1,
                "timestamp": new Date(),
                products: []
            }
            await fs.promises.writeFile("./public/carrito.txt", JSON.stringify([newCarrito], null, 2));
        }
    }

    getById = async (carritoId) => {
        if (fs.existsSync("./public/carrito.txt")) {
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8")
            const newData = JSON.parse(data)
            const carritoFiltred = newData.find (el => el.id === parseInt(carritoId))
            return carritoFiltred
        }
    }

    deleteById = async (id) => {
        if (fs.existsSync("./public/carrito.txt")) {
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8")
            const newData = JSON.parse(data)
            const newArray = newData.filter((el) => el.id !== parseInt(id))
            await fs.promises.writeFile(
                "./public/carrito.txt",
                JSON.stringify(newArray, null, 2)
            )
            return newArray
        }
    }

    anadirProducto = async (carritoId, productId) => {
        if (fs.existsSync("./public/carrito.txt")) {
            //Inicio filtrar por carrito
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8");
            const newData = JSON.parse(data);
            const carritoFiltred = newData.find(el => el.id === parseInt(carritoId))
            //Resultado carrito filtrado acorde al carritoId
            // Inicio filtrar por producto
            const dataProduct = await fs.promises.readFile("./public/productos.txt", "utf-8");
            const arrayProducts = JSON.parse(dataProduct);
            const productFiltred = arrayProducts.find(el => el.id === parseInt(productId))
            // Resultado producto filtrado acorde al productId
            // Añadir el producto filtrado al carrito filtrado
            carritoFiltred.products.push(productFiltred)
            // se sobrescribe el nuevo archivo
            await fs.promises.writeFile(
                "./public/carrito.txt",
                JSON.stringify(newData, null, 2)
            )
            return newData
        }
    }

    deleteProducto = async (carritoId, productId) => {
        if (fs.existsSync("./public/carrito.txt")) {
            //Inicio filtrar por carrito
            const data = await fs.promises.readFile("./public/carrito.txt", "utf-8");
            const newData = JSON.parse(data);
            const carritoFiltred = newData.find(el => el.id === parseInt(carritoId))
            //Resultado carrito filtrado acorde al carritoId
            // Inicio eliminar producto del array de productos de carrito
            const productDeleted = carritoFiltred.products.filter(el => el.id !== parseInt(productId))
            // Añadir el nuevo array de productos sin el producto deleteado en el array del carrito filtrado
            carritoFiltred.products = productDeleted  
            // se sobrescribe el nuevo archivo
            await fs.promises.writeFile(
            "./public/carrito.txt",
            JSON.stringify(newData, null, 2)
            )
            return newData
        }
    }
}

export default Carrito
