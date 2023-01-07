const express = require("express");
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();
const fs = require("fs");
const ADMINISTRADOR = true;

routerProductos.route("/")
    .get((req, res) => {
        res.send({ success: "lista de todos los productos" });
    })
    .post((req, res) => {
        if (ADMINISTRADOR) {
            res.send({ success: `Producto ${JSON.stringify(req.body)} añadido` });
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos", método "POST" no autorizada' });
        }
    });

routerProductos.route("/:id")
    .get((req, res) => {
        res.send({ success: `producto ${req.params.id}` });
    })
    .put((req, res) => {
        if (ADMINISTRADOR) {
            res.send({ success: `actualizar ${req.params.id}` });
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos/:id", método "PUT" no autorizada' });
        }
    })
    .delete((req, res) => {
        if (ADMINISTRADOR) {
            res.send({ success: `borrar ${req.params.id}` });
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos/:id", método "DELETE" no autorizada' });
        }
    });

routerCarrito.route("/")
    .post((req, res) => {
        res.send({ success: `Carrito ${JSON.stringify(req.body)} añadido` });
    });

routerCarrito.route("/:id")
    .delete((req, res) => {
        res.send({ success: `borrar ${req.params.id}` });
    });

routerCarrito.route("/:id/productos")
    .get((req, res) => {
        res.send({ success: `producto ${req.params.id}` });
    })
    .post((req, res) => {
        res.send({ success: `agregar ${req.params.id}` });
    });

routerCarrito.route("/:id/productos/:id_prod")
    .delete((req, res) => {
        res.send({ success: `borrar ${req.params.id_prod} de ${req.params.id}` });
    });

// SERVER CONFIG
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
// app.use(express.static('public'));
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

// SERVER INIT
const server = app.listen(8080, () => {
    console.log(`Servidor iniciado en puerto ${server.address().port}`);
});
// MANEJO DE ERRORES SERVIDOR
server.on("error", (e) => console.log(e));
