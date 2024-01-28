const { Router } = require("express");
const ProductManager = require("../ProductManager");
const CartManager = require("../CartManager");
const Carrito = require("../Cart");

const router = Router();

const inicializarManagerProduct = async () => {
    try {
        const manager = new ProductManager("C:/Users/manum/ideaProjects/PrimeraEntrega_MercadoEmanuel/.idea/productos.json");
        return manager;
    } catch (error) {
        console.log("-app - inicializarManager", error);
    }
}

const inicializarManagerCarrito = async () => {
    try {
        const manager = new CartManager("C:/Users/manum/ideaProjects/PrimeraEntrega_MercadoEmanuel/.idea/carts.json");
        return manager;
    } catch (error) {
        console.log("-app - inicializarManager", error);
    }
}

const startRouter = async () => {

    const managerProducts = await inicializarManagerProduct();
    const managerCarts = await inicializarManagerCarrito();
    router.get('/', async (req, res) => {
        try{
            const resul = await managerCarts.getCarritos();
            console.lgo(resul);
            if(resul == null) {
                res.send("No hay carritos");
            }else{
                return res.json(resul);
            }
        }catch{
            return res.status(400).send("Error - getCarts");
        }
    });

    router.get('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try{
            //Devolvemos el array del carrito con los productos
            return res.json(await managerCarts.getCarritoById(id).getProductsJSON());
        }catch{
            return res.status(400).send("Error - getCartById");
        }
    });
    //TODO
    router.post('/', async (req, res) => {
        try{
            const body = req.body;
            if(!body.products){
                console.log("Faltan propiedades del carrito");
                return null;
            }else{
                let arrayProducts = [];
                body.products.map((p) => {
                    arrayProducts.push(p);
                });
                const carrito = new Carrito(arrayProducts);
                carrito.setId(CartManager.contador++);
                console.log(managerCarts.contador++);
                await managerCarts.addCarrito(carrito);
                return res.json(carrito);
            }
        }catch{
            return res.status(400).send("Error - addCart");
        }
    });
    //TODO
    router.post('/:id/productos/:id_producto', async (req, res) => {
        try {
            console.log("entro");
            const id = parseInt(req.params.id);
            console.log(id);
            const id_producto = parseInt(req.params.id_producto);
            console.log(id_producto);

            const carrito = await managerCarts.getCarritoById(id);

            console.log(carrito);
            if (!managerCarts.carts[id]) {
                carrito.products.map((p) => {
                    if (p.id === id_producto) {
                        p.quantity++;
                    }
                });
            } else {
                console.log("El carrito o el producto no existen");
                return null;
            }
        }catch{
            return res.status(400).send("Error - addProductCarts");
        }
    });
}
startRouter();

module.exports = router;