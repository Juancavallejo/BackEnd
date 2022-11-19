import ContenedorProductosMysql from "../../Contenedores/ClassProductsMySql.js";

//Subclase productos Sql
class productsDaoSql extends ContenedorProductosMysql {
    constructor (tablename){
        // ejecuta el constructor de la clase Contenedor de FileSystem
        super(tablename);
    }
}

export {productsDaoSql}