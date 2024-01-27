const fs = require("fs").promises;
const Product = require("./Product");
class ProductManager {

    static contador = 0;
    constructor(path) {
        this.path = path;
        this.products = [];
        this.setProducts();
    }

    validarProducto(product) {
        return !this.products.some((p) => p.code === product.code);
    }
    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.code || !product.stock) {
            console.log("¡Faltan propiedades del producto!");
            return null;
        } else if (this.validarProducto(product)) {
            try {
                product.setId(ProductManager.contador++);
                this.products.push(product);
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return product;
            } catch (error) {
                console.log("-productmanager - addProduct", error);
            }
        } else {
            //Si el producto ya existe actualizamos el stock lo sumamos.
            const productExistente = await this.getProductByCode(product.code);
            this.products[productExistente.id].stock += product.stock;
            await fs.writeFile(this.path, JSON.stringify(this.products));
            return product;
        }
    }
    async setProducts() {
        try {
            let jsonData;
            await fs.readFile(this.path, "utf-8").then((data) => {
                if (data === undefined || data === null || data === "") {
                    jsonData = undefined;
                } else {
                    jsonData = JSON.parse(data);
                }
            });
            if (jsonData === undefined || jsonData === null || jsonData === "") {
                this.products = [];
            } else {
                jsonData.map((p) => {

                    let product = new Product(p.title, p.description, p.price, p.status, p.thumbnail, p.code, p.stock, p.category);
                    if (this.validarProducto(product)) {
                        product.setId(ProductManager.contador++);
                        this.products.push(product);
                    } else {
                        console.log("El producto ya existe");
                    }
                });
            }
            return this.products;
        } catch (error) {
            console.log("-productmanager - getProducts", error);
            return null;
        }
    }

    async getProducts() {
        return this.products;
    }

    async getJsonProducts() {
        return JSON.stringify(this.products);
    }

    async getProductsLimit(limit) {
        try {
            if (limit === undefined) {
                limit = this.products.length;
            }
            if (limit !== isNaN && limit >= 0) {
                limit > this.products.length ? limit = this.products.length : limit = limit; // setear limite
                let jsonResult = JSON.stringify(this.products.slice(0, limit));
                return jsonResult;
            } else {
                console.log("El limite debe ser un numero mayor o igual a 0");
                return null;
            }
        } catch (error) {
            console.log("-productmanager - getProductsLimit", error);
        }
    }

    async getProductById(id) {
        try {
            const product = this.products.find((p) => p.id === id);
            if (!product) {
                console.log("No se encontró el producto");
            }
            return product;
        } catch (error) {
            console.log("-productmanager - getProductById", error);
            return null;
        }
    }

    async getProductByCode(code) {
        try {
            const product = this.products.find((p) => p.code === code);
            if (!product) {
                console.log("No se encontró el producto");
            }
            return product;
        } catch (error) {
            console.log("-productmanager - getProductByCode", error);
            return null;
        }
    }

    async updateProduct(id, obj) {
        try {
            const index = this.products.findIndex((p) => p.id === id);
            if (index === -1 || index >= this.products.length) {
                console.log("No se encontró el producto");
            } else {
                this.products[index].title = obj.title;
                this.products[index].description = obj.description;
                this.products[index].price = obj.price;
                this.products[index].thumbnail = obj.thumbnail;
                this.products[index].stock = obj.stock;
                this.products[index].category = obj.category;
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return this.products[index];
            }
        } catch (error) {
            console.log("-productmanager - updateProduct", error);
            return null;
        }
    }

    async deleteProductById(id) {
        try {
            const product = this.products.find((p) => p.id === id);
            if (!product) {
                console.log("No se encontró el producto");
                return null;
            } else {
                this.products = this.products.filter((p) => p.id !== id);
                await fs.writeFile(this.path, JSON.stringify(this.products));
                return product;
            }
        } catch (error) {
            console.log("-productmanager - deleteProductById", error);
            return null;
        }
    }
    async deleteAllProducts(){
        try{
            this.products = [];
            await fs.writeFile(this.path, JSON.stringify(this.products));
            return this.products;
        }catch(error){
            console.log("-productmanager - deleteAllProducts", error);
            return null;
        }
    }
}
module.exports = ProductManager;