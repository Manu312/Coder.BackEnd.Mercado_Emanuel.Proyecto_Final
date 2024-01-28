const fs = require("fs").promises;
const Cart = require("../src/Cart");

class CartManager {
    static contador = 0;

    constructor(path) {
        this.path = path;
        this.carts = [];
        this.setCarts();
    }
    validarCarrito(carrito) {
        return !this.carts.some((c) => c.id === carrito.id);
    }

    async addCarrito(carrito) {
        try{
            if(this.validarCarrito(carrito)){
                this.carts.push(carrito);
                console.log(this.carts);
                await fs.writeFile(this.path, JSON.stringify(this.carts));
                return carrito;
            }else{
                console.log("El carrito ya existe");
                return null;
            }
        }catch (error){
            console.log("-cartmanager - addCarrito", error);
        }
    }
    async setCarts(){
        try{
            let jsonData;
            await fs.readFile(this.path, "utf-8").then((data) => {

                if (data === undefined || data === null || data === "") {
                    jsonData = undefined;
                } else {
                    jsonData = JSON.parse(data);
                }
            });
            if(jsonData === undefined || jsonData === null || jsonData === "") {
                this.carts = [];
            } else {
                jsonData.map((c) => {
                    let cart = new Cart(c);
                    cart.setId(CartManager.contador++);
                    if (this.validarCarrito(cart)) {
                        this.carts.push(cart);
                    } else {
                        console.log("El carrito ya existe");
                    }
                });
            }
            console.log(this.carts);
        } catch (error) {
            console.log("-cartmanager - setCarts", error);
            return null;
        }
    }
    async getCarritos(){
        try{
            return this.carts;
        }catch (error){
            console.log("-cartmanager - getCarritos", error);
            return null;
        }
    }
    async getJsonCarritos(){
        return JSON.stringify(this.carts);
    }
    async getCarritoById(id){
        try{
            const carrito = this.carts.find((c) => c.id === id);
            if(!carrito){
                console.log("El carrito no existe");
                return null;
            }else{
                return carrito;
            }
        }catch (error){
            console.log("-cartmanager - getCarritoById", error);
            return null;
        }
    }
    async deleteCarritoById(id){
        try{
            const carrito = await this.getCarritoById(id);
            if(!carrito){
                console.log("El carrito no existe");
                return null;
            }else{
                await this.carts.splice(carrito.id,1);
                await fs.writeFile(this.path, JSON.stringify(this.carts));
                return carrito;
            }
        }catch (error){
            console.log("-cartmanager - deleteCarritoById", error);
            return null;
        }
    }
    async deleteAllCarritos(){
        try{
            this.cart = [];
            await fs.writeFile(this.path, JSON.stringify(this.carts));
            return this.carts;
        }catch (error){
            console.log("-cartmanager - deleteAllCarritos", error);
            return null;
        }
    }
}
module.exports = CartManager;