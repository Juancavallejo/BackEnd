import { Application, config } from "../../denoServer/depts.ts"
import { productRouter} from "./routes/products.routes.ts"

const app = new Application(); 
const {PORT} = config()

/* app.use((ctx) => {
    ctx.response.body="Bienvenido al servidor deno"
}) */
app.use (productRouter.routes())

app.listen ({port:Number(PORT)})
console.log (`Server listening on ${PORT}`)