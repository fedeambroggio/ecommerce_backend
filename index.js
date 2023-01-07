const express = require("express");
const app = express();
const router = express.Router();
const fs = require("fs");


// SERVER CONFIG
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
// app.use(express.static('public'));
app.use('/', router);

// SERVER INIT
const server = app.listen(8080, () => {
    console.log(`Servidor iniciado en puerto ${server.address().port}`)
})
// MANEJO DE ERRORES SERVIDOR
server.on("error", (e) => console.log(e))