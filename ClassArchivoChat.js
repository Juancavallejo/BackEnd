
const fs = require ('fs');

class ArchivoChat {
    constructor (nameFile) {
        this.nameFile = nameFile;
    }

    save = async (mensaje) => {
        const data = await fs.promises.readFile("./public/historial.txt", "utf-8");
        if (data) {
            const historial = JSON.parse (data)
            historial.push(mensaje)
            await fs.promises.writeFile ("./public/historial.txt", JSON.stringify(historial, null, 2));   
        } else {
            const historial = []
            historial.push (mensaje)
            await fs.promises.writeFile ("./public/historial.txt", JSON.stringify(historial, null, 2)); 
        } 
    }

    readAll = async () => {
        if (fs.existsSync("./public/historial.txt")) {
            const data = await fs.promises.readFile("./public/historial.txt", "utf-8");
            const newData = JSON.parse (data)
            return newData
        }
    }
}

const mensajesGuardados = new ArchivoChat ("historial.txt")

module.exports = ArchivoChat;



