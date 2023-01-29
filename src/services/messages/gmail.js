import {createTransport} from "nodemailer"

// Guardar order de compra
export const testEmail = "juancamilovallejo@gmail.com";
const testPass = 'jeyhyoaaqcjtahnm'

// Configuración del transporter - Gmail
export const transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: testEmail,
        pass: testPass
    },
    secure: false,
    tls: {
        rejectUnauthorized: false,
    }
});
