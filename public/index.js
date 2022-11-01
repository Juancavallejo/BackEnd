
const socketClient = io();

// Agregar al HTML
const productsContainer = document.querySelector("#productsContainer")
const messageField = document.querySelector("#messageField")
const btnSubmitChat = document.querySelector (".btnSubmitChat")
const messageContainer = document.querySelector ("#messageContainer")

let userEmail; 
Swal.fire ({
    title: "Registro de usuario",
    text: "Bienvenido, ingresa por favor tu correo electronico para acceder al servidor",
    input: "email",
    inputPlaceholder: 'Ingresa tu correo electronico',
    allowOutsideClick: false
}).then(response => {
    userEmail = response.value;
});

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

btnSubmitChat.addEventListener ("click", ()=> envioDatosSocket())

const envioDatosSocket = () => {
    socketClient.emit ("message", {
        userEmail: userEmail,
        message: messageField.value
    })
}

messageField.addEventListener ("keydown", (e) => {
    if (e.key === "Enter") {
        socketClient.emit ("message", {
            userEmail: userEmail,
            message: messageField.value
        })
    }
})

socketClient.on ("historial", (historial) => {
    let elementos =""
    historial.forEach (element => {
        elementos = elementos + `<p><strong>${element.userEmail}</strong> 
        : ${element.message}</p>`
        messageContainer.innerHTML = elementos;
    })
})