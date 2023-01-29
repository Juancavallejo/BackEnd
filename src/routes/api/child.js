export const numeroAleatorios = (qty) => {
    let arrayAleatorio = []
    for (let i = 0; i <qty; i++) {
        const numeroAleatorio = (Math.ceil((Math.random()*1000)))
        arrayAleatorio.push(numeroAleatorio)
        /*     if (arrayAleatorio [numeroAleatorio]) {
            arrayAleatorio [numeroAleatorio] ++
        } else {
            arrayAleatorio [numeroAleatorio] = 1;
        } */
    }
    return arrayAleatorio
}

/* process.send("listo"); //proceso hijo listo para trabajar

////recibimos los mensajes del proceso padre.
process.on("message",(parentMsg)=>{
    // console.log("parentMsg", parentMsg);
    if(parentMsg === "Iniciar"){
        const resultadoSuma = numeroAleatorios(100000000);
        //enviamos el resultado de la operacion del proceso hijo al proceso padre
        process.send(resultadoSuma);
    }
}) */