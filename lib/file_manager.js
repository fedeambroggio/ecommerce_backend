const fs = require("fs");

class FileManager {
    constructor(_nombre) {
        this.nombre = _nombre;
    }

    async save(_content) {
        const existingContent = await this.read();

        //AGREGAR AL CONTENIDO DEL ARCHIVO EXISTENTE
        const existingContentParsed = JSON.parse(existingContent);

        let newItemId = 1;
        if (existingContentParsed.length > 0) {
            //To prevent insert error after deleteAll
            newItemId = parseInt(
                existingContentParsed[existingContentParsed.length - 1]["id"] +
                    1
            );
        }

        const newContent = [
            ...existingContentParsed,
            {
                id: parseInt(newItemId),
                ..._content,
            },
        ];

        try {
            await fs.promises.writeFile(
                `./${this.nombre}.txt`,
                JSON.stringify(newContent)
            );
            return newItemId;
        } catch (err) {
            console.log(err);
        }
    }

    async read() {
        try {
            const data = await fs.promises.readFile(
                `./${this.nombre}.txt`,
                "utf-8"
            );
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async getById(_id) {
        const existingContent = await this.read();
        
        const existingContentParsed = JSON.parse(existingContent);
        const found = existingContentParsed.find(
            (el) => el.id === parseInt(_id)
        );
        
        if (found) {
            return found;
        } else {
            return null;
        }
    }

    async getProductosOnCarritoById(_id) {
        const carritoGet = await this.getById(_id);
        if (carritoGet) return carritoGet.productos;
        else return null;
    }

    async saveProductosOnCarritoById(_id, _productos) {
        const existingContent = await this.read();
        const existingContentParsed = JSON.parse(existingContent);

        const found = existingContentParsed.find(
            (el) => el.id === parseInt(_id)
        );

        if (found) {
            const carritoIdx = existingContentParsed.indexOf(found);

            const newProductsContent = [
                ...found["productos"],
                ..._productos,
            ];

            found["productos"] = newProductsContent;
            existingContentParsed[carritoIdx] = found;

            try {
                await fs.promises.writeFile(
                    `./${this.nombre}.txt`,
                    JSON.stringify(existingContentParsed)
                );
                return true;
            } catch (err) {
                console.log(err);
            }
        } else return null;
    }

    async deleteProductByIdOnCarritoById(_id, _id_prod) {
        const existingContent = await this.read();
        const existingContentParsed = JSON.parse(existingContent);

        const carritoFound = existingContentParsed.find(
            (el) => el.id === parseInt(_id)
        );
        

        if (carritoFound) { 
            const carritoIdx = existingContentParsed.indexOf(carritoFound);

            const filteredProductOnCarrito = carritoFound.productos.filter(
                (el) => el.id !== parseInt(_id_prod)
            );
            
            carritoFound.productos = filteredProductOnCarrito
            existingContentParsed[carritoIdx] = carritoFound;

            try {
                await fs.promises.writeFile(
                    `./${this.nombre}.txt`,
                    JSON.stringify(existingContentParsed)
                );
            } catch (err) {
                console.log(err);
            }
            return true;
         } else return null;
    }

    async getAll() {
        const existingContent = await this.read();
        return JSON.parse(existingContent);
    }

    async update(_id, _content) {
        const existingContent = await this.read();

        const existingContentParsed = JSON.parse(existingContent);
        let found = existingContentParsed.find((el) => el.id === parseInt(_id));
        if (found) {
            const newContent = {
                id: parseInt(_id),
                ..._content,
            };

            const index = existingContentParsed.indexOf(found);
            existingContentParsed[index] = newContent;

            try {
                await fs.promises.writeFile(
                    `./${this.nombre}.txt`,
                    JSON.stringify(existingContentParsed)
                );
            } catch (err) {
                console.log(err);
            }
            return true;
        } else {
            return null;
        }
    }

    async deleteById(_id) {
        const existingContent = await this.read();
        //CREAR NUEVO ARRAY, SIN EL ID SELECCIONADO
        const existingContentParsed = JSON.parse(existingContent);
        const result = existingContentParsed.filter(
            (el) => el.id !== parseInt(_id)
        );

        if (result) {
            try {
                await fs.promises.writeFile(
                    `./${this.nombre}.txt`,
                    JSON.stringify(result)
                );
            } catch (err) {
                console.log(err);
            }
            return parseInt(_id);
        } else {
            console.log(`Item id: ${_id} no fue encontrado`);
            return null;
        }
    }
}

module.exports = FileManager;
