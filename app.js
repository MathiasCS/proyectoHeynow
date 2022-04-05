//Dependencias utilizadas
const fs = require ("fs");
const qrcode = require ("qrcode-terminal");
const { Client } = require ("whatsapp-web.js");
const express = require('express')
const app = express()

app.use(express.urlencoded({ extended : true}))


const sendwithApi = (req, res) => {
    const {message, to} = req.body
    res.send({status: "Enviado"})
}
//Se crea una constante para conectar a POSTMAN
app.post("/send",sendwithApi)

const SESSION_FILE_PATH= "./session.js";

let sessiondata;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessiondata = require(SESSION_FILE_PATH)
}

const client = new Client();

client.initialize();

client.on ("qr", qr => {
    qrcode.generate(qr, {small:true} )
})

client.on ("ready", () => {
    console.log ("El cliente esta listo")
    listenMessage();

});

//Se crea para autentificar la sesión del cliente

client.on('authenticated', (session) => {
    sessionData = session;
    if(sessionData){
        fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
            if (err) {
                console.log(`Ocurrio un error con el archivo: `, err);
            }
        });
    }
});

client.on ("auth_failure", msg => {
    console.error ("Hubo un fallo en la autenticación", msg);
})

//Esta función se encarga de recibir el mensaje del cliente y responder en los casos predeterminados
const listenMessage = () => {
    client.on ("message", () => {
        const {from, to, body} = msg;

        switch (body) {
            case "Hola":
                sendMessage(from, "Hola bienvenid@ a Quantik")
                break;
                case "como estas":
                    sendMessage (from, "¿Bien y tu?")
                    break;
        }

        console.log(from, to, body);
    })
}

//Esta función se creo para responder los mensajes del cliente
const sendMessage = (to, message) => {

    client.sendMessage(to, message)
}

app.listen(3000, () => {
    console.log("API ESTA ACTIVA")
})


