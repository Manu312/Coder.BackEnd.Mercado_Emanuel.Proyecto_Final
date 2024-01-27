const { Router } = require("express");
const ProductManager = require("../ProductManager");

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
        const manager = new ProductManager("C:/Users/manum/ideaProjects/PrimeraEntrega_MercadoEmanuel/.idea/carritos.json");
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
            if(!body.id  && !body.products){
                console.log("Faltan propiedades del carrito");
                return null;
            }else{
                let arrayProducts = [];
                JSON.parse(body.products).map((p) => {
                    let product =  [p.id,p.quantity];
                    arrayProducts.push(product);
                });
                const id = parseInt(body.id);
                const carrito = new Carrito(id, arrayProducts);
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
            const id = parseInt(req.params.id);
            const id_producto = parseInt(req.params.id_producto);
            const carrito = await managerCarts.getCarritoById(id);
            const product = await managerProducts.getProductById(id_producto);
            if (carrito !== null && product !== null) {
                if (await carrito.existeProducto(id_producto)) {
                    await carrito.addProduct(id_producto, 1);
                    return res.json(carrito);
                } else {
                    await carrito.addProduct(id_producto, 1);
                    return res.json(carrito);
                }
            } else {
                console.log("El carrito o el producto no existen");
                return null;
            }
        }catch{
            return res.status(400).send("Error - addProductCart");
        }
    });
}

startRouter();
module.exports = router;