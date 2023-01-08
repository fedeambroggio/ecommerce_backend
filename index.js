const express = require("express");
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();
const ADMINISTRADOR = true;
const Producto = require('./lib/producto.js');
const Carrito = require('./lib/carrito.js');
const FileManager = require('./lib/file_manager.js');

const ProductosFileManager = new FileManager('productos')
const CarritosFileManager = new FileManager('carritos')

routerProductos.route("/")
    .get(async (req, res) => {
        const productosGet = await ProductosFileManager.getAll();
        res.send(productosGet)
    })
    .post((req, res) => {
        if (ADMINISTRADOR) {
            const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
            const newProduct = new Producto(nombre, descripcion, codigo, foto, precio, stock)
            ProductosFileManager.save(newProduct)
            res.send({success: `Producto ${JSON.stringify(newProduct)} añadido`})
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos", método "POST" no autorizada' });
        }
    });

routerProductos.route("/:id")
    .get(async (req, res) => {
        const productoGet = await ProductosFileManager.getById(req.params.id)
        if (productoGet)
            res.send({
                success: `Producto ${req.params.id} encontrado`,
                data: productoGet
            })
        else 
            res.send({error: "Producto no encontrado"})
    })
    .put((req, res) => {
        if (ADMINISTRADOR) {
            const productoUpdated = ProductosFileManager.update(req.params.id, req.body)
            if (productoUpdated)
                res.send({success: `Producto ${productoUpdated} editado`})
            else 
                res.send({error: "Producto no encontrado"})
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos/:id", método "PUT" no autorizada' });
        }
    })
    .delete((req, res) => {
        if (ADMINISTRADOR) {
            const productoDeleted = ProductosFileManager.deleteById(req.params.id)
        if (productoDeleted)
            res.send({success: `Producto ${productoDeleted} eliminado`})
        else 
            res.send({error: "Producto no encontrado"})
        } else {
            res.send({ error: '-1', descripcion: 'ruta "/api/productos/:id", método "DELETE" no autorizada' });
        }
    });

routerCarrito.route("/")
    .post(async (req, res) => {
        const { productos } = req.body;
        
        let productsToAdd = [];
        if (productos.length > 0) {
            await productos.map(async idProd => {
                const productoGet = await ProductosFileManager.getById(idProd)
                
                if (productoGet) {
                    const { nombre, descripcion, codigo, foto, precio, stock } = productoGet;
                    productsToAdd.push({ id: idProd, ...new Producto(nombre, descripcion, codigo, foto, precio, stock) })
                }
            })
        }
        
        const newCarrito = new Carrito(productsToAdd)
        CarritosFileManager.save(newCarrito)
        res.send({success: `Carrito ${JSON.stringify(req.body)} añadido`})
    });

routerCarrito.route("/:id")
    .delete((req, res) => {
        const carritoDeleted = CarritosFileManager.deleteById(req.params.id)
        if (carritoDeleted)
            res.send({success: `Carrito ${carritoDeleted} eliminado`})
        else 
            res.send({error: "Carrito no encontrado"})
    });

routerCarrito.route("/:id/productos")
    .get(async (req, res) => {
        const productoGet = await CarritosFileManager.getProductosOnCarritoById(req.params.id)
        if (productoGet)
            res.send({
                success: `Productos de carrito ${req.params.id} encontrados`,
                data: productoGet
            })
        else
            res.send({error: "Productos de carrito no encontrados"})
    })
    .post(async (req, res) => {

        let productsToAdd = [];
        const { productos } = req.body;
        productos.map(async idProd => {
            const productoGet = await ProductosFileManager.getById(idProd)
            if (productoGet) {
                const { nombre, descripcion, codigo, foto, precio, stock } = productoGet;
                productsToAdd.push({ id: idProd, ...new Producto(nombre, descripcion, codigo, foto, precio, stock) })
            }
        })

        const productoSaved = await CarritosFileManager.saveProductosOnCarritoById(req.params.id, productsToAdd)
        if (productoSaved) {
            res.send({success: `Productos ${JSON.stringify(req.body)} añadidos al carrito ${req.params.id}`})
        } else 
            res.send({error: "Productos de carrito no guardados"})
    });

routerCarrito.route("/:id/productos/:id_prod")
    .delete((req, res) => {
        const carritoDeleted = CarritosFileManager.deleteProductByIdOnCarritoById(req.params.id, req.params.id_prod)
        if (carritoDeleted)
            res.send({ success: `borrar ${req.params.id_prod} de ${req.params.id}` });
        else 
            res.send({error: "Carrito o producto no encontrado"})
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
