class Producto {
    constructor(
        // _id,
        _nombre,
        _descripcion,
        _codigo,
        _foto,
        _precio,
        _stock,
        _timestamp = Date.now()
    ) {
        // this.id = _id;
        this.nombre = _nombre;
        this.descripcion = _descripcion;
        this.codigo = _codigo;
        this.foto = _foto;
        this.precio = _precio;
        this.stock = _stock;
        this.timestamp = _timestamp;
    }
}

module.exports = Producto;
