import { connectDB} from "../../../options/DbConfig.js"
import { applyDto } from "../../dtos/user.dto.js";

connectDB()

class ContenedorUsersMongo {
    constructor (baseName) {
         this.baseName = baseName;
    }

    getAll = async () => {
        const response = await (this.baseName).find();
        const data = JSON.parse(JSON.stringify(response));
        const responseDto = applyDto (data)
        return responseDto
    }
}

export default ContenedorUsersMongo