
const socketClient = io();

// Agregar al HTML
const productsContainer = document.querySelector("#productsContainer")
const messageField = document.querySelector("#messageField")
const btnSubmitChat = document.querySelector (".btnSubmitChat")
const messageContainer = document.querySelector ("#messageContainer")

// Formulario de ingreso a la aplicación y que guarda los datos para el uso del chat.
Swal.fire({
    title: 'Formulario de ingreso',
    html: `<input type="text" id="email" class="swal2-input" placeholder="Correo">
    <input type="text" id="nombre" class="swal2-input" placeholder="Nombre">
    <input type="text" id="apellido" class="swal2-input" placeholder="Apellido">
    <input type="number" id="edad" class="swal2-input" placeholder="Edad">
    <input type="alias" id="alias" class="swal2-input" placeholder="Alias">`,
    confirmButtonText: 'Enviar información',
    focusConfirm: false,
    preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value;
        const nombre = Swal.getPopup().querySelector('#nombre').value;
        const apellido = Swal.getPopup().querySelector("#apellido").value;
        const edad = Swal.getPopup().querySelector("#edad").value;
        const alias = Swal.getPopup().querySelector("#alias").value;
        
        if (!email || !nombre || !apellido || !edad || !alias) {
            Swal.showValidationMessage(`Por favor complete todos los datos para ingresar`);
        }
        return { email, nombre, apellido, edad, alias}
    },
    allowOutsideClick: false
}).then((response) => {
    Swal.fire(`
      Email: ${response.value.email}
      Nombre: ${response.value.nombre}
      Apellido: ${response.value.apellido}
      Edad: ${response.value.edad}
      Alias: ${response.value.alias}
    `.trim());
    userInfo = response.value;
});

// -------------------------------------------------------- // 
// Logica de la carga de productos. 
socketClient.on ("allProducts", (url) => {
    let products = ""
    fetch(url)
    .then (resp => resp.json())
    .then ((data) => data.forEach(element => {
        products = products + 
        `<div class="card shadow d-inline-flex m-4" style="width: 20rem;">
            <img src=${element.thumbnail} alt=${element.title}>
            <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.price}</p>
            </div>
        </div>`
        productsContainer.innerHTML = products
        })
    );  
})


// -------------------------------------------------------- // 
// Logica del chat. 

// Manejadores de enventos, botón enter. 
btnSubmitChat.addEventListener ("click", ()=> envioDatosSocket())

// Función que se activa y envia datos en caso de presionar el botón enviar. 
const envioDatosSocket = () => {
    socketClient.emit ("message", {
        author: userInfo,
        message: messageField.value,
        timestamp: new Date().toLocaleString(),
    })
}

// Envio de datos en caso de presionar Enter
messageField.addEventListener ("keydown", (e) => {
    if (e.key === "Enter") {
        socketClient.emit ("message", {
            author: userInfo,
            message: messageField.value,
            timestamp: new Date().toLocaleString(),
        })
        messageField.value = "";
    }
})

// Schemas que se activan al usar websockets frente al chat. 
const autorSchema = new normalizr.schema.Entity("authors", {}, {idAttribute:"userEmail"})
const messageSchema = new normalizr.schema.Entity("messages", {author: autorSchema})
const chatSchema = new normalizr.schema.Entity ("chat", {
    message: [messageSchema]
}, {idAttribute:"id"});

// Envio de historial de mensajes al inicial la pagina y al enviar cualquier mensaje.
socketClient.on ("cargaMensajes", (historial) => {
    const normalData = normalizr.denormalize(historial.result, chatSchema, historial.entities)
    let elementos =""
    normalData.messages.forEach (element => {
        elementos = elementos + `<p><strong>${element.author.email}</strong> 
        : ${element.message}</p>`
        messageContainer.innerHTML = elementos;
    })
})

