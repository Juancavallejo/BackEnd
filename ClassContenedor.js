import fs from "fs"


class Contenedor {
    constructor (nameFile) {
        this.nameFile = nameFile;
    }

    save = async(product) => {
        try {
            if (fs.existsSync("./public/productos.txt")) {
                const contenido = await fs.promises.readFile("./public/productos.txt", "utf-8")
                if (contenido) {
                    const productos = JSON.parse(contenido);
                    const newProduct = {
                        id:productos.length +1,
                        codigo: productos.length +1,
                        stock: 10,
                        timestamp: new Date(),
                        ...product,
                        descripcion: `Este producto es/son ${product.title}`
                    }
                    productos.push(newProduct);
                    fs.promises.writeFile("./public/productos.txt", JSON.stringify(productos, null, 2))
                }
                } else {
                const newProduct = {
                    ...product,
                    id: 1,
                    timestamp: new Date(),
                    codigo: 1,
                    stock: 10,
                    descripcion: `Este producto es/son ${product.title}`,
                }
              await fs.promises.writeFile ("./public/productos.txt", JSON.stringify([newProduct], null, 2));
            }
            } catch (error) {
                console.log (error);
            }
    }

    getById = async(id) => {
        try {
            if (fs.existsSync("./public/productos.txt")) {
                const data = await fs.promises.readFile("./public/productos.txt", "utf-8");
                if (data) {
                    const newData = JSON.parse(data);
                    const producto = newData.find ((elemento) => elemento.id === id);
                    return producto
                } else {
                    return "El archivo está vacio"
                }
                
            }
        } catch (error) {
            console.log (error)
        }
    } 

    getAll = async () => {
        if (fs.existsSync("./public/productos.txt")) {
            const data = await fs.promises.readFile("./public/productos.txt", "utf-8");
            const newData = JSON.parse (data);
            return newData
        }
    }

    deleteById = async (id) => {
        try {
            if (fs.existsSync("./public/productos.txt")) {
                const data = await fs.promises.readFile("./public/productos.txt", "utf-8");
                const newData = JSON.parse (data)
                const newArray = newData.filter ((el) => el.id !== parseInt(id));
                await fs.promises.writeFile(
                    "./public/productos.txt", 
                    JSON.stringify(newArray, null, 2)
                );
                return newArray
            }
        } catch (error) {
            console.log (error)
        }
    }

    updateById = async (id, body) => {
        try {
            const data = await this.getAll(); 
            const prodPos = data.findIndex (el => el.id === id);
            data[prodPos] = {
                id: id,
                ...body
            };
            await fs.promises.writeFile ("./public/productos.txt", JSON.stringify(data, null, 2))
            return data;
        } catch (error) {
            console.log (error)
        }
    }

}

const listaItems = new Contenedor ("productos.txt")

export default Contenedor




