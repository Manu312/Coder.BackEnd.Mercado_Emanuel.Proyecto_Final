const { Router } = require("express");
const ProductManager = require("../ProductManager");
const Product = require("../Product");

const router = Router();

const inicializarManager = async () => {
    try {
        const manager = new ProductManager("C:/Users/manum/ideaProjects/PrimeraEntrega_MercadoEmanuel/.idea/productos.json");
        return manager;
    } catch (error) {
        console.log("-app - inicializarManager", error);
    }
}

const startRouter = async () => {
    const manager = await inicializarManager();
    router.get('/', async (req, res) => {
        let limit = req.query.Limit;
        try {
            const resul = await manager.getProductsLimit(limit);
            if (resul == null) {
                res.send("El limite debe ser un numero");
            } else {
                return res.json(resul);
            }
        } catch {
            console.log("El limite debe ser un numero");
            return res.status(400).send("Error - getProductsLimit");
        }
    });

    router.get('/:id', async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            return res.json(await manager.getProductById(id));
        } catch {
            return res.status(400).send("Error - getProductById");
        }
    });

    router.post('/:title/:description/:code/:price/:status/:stock/:category', async (req, res) => {
        try {
            const body = req.body;
            body.status = true;
            const thumbnail = req.query.thumbnail ||  "";
            const product = new Product(body.title, body.description, body.price, body.status, thumbnail, body.code, body.stock, body.category);
            const resul = await manager.addProduct(product);
            return res.json(resul);
        } catch {
            return res.status(400).send("Error - addProduct");
        }
    });
    router.put('/:title/:description/:code/:price/:status/:stock/:category', async (req, res) => {
        try {
            const body = req.body;
            const thumbnail = req.query.thumbnail ||  "";
            body.thumbnail = thumbnail;
            console.log(body.code);
            const product = await manager.getProductByCode(body.code);
            console.log(product);
            if(product !== null){
                const resul = await manager.updateProduct(product.id, body);
                return res.json(resul);
            }else{
                return res.status(400).send("Error - updateProduct");
            }

        } catch {
            return res.status(400).send("Error - updateProduct");
        }
    });
    router.delete('/:id', async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            console.log(id);
            const resul = await manager.deleteProductById(id);
            return res.json(resul);
        } catch {
            return res.status(400).send("Error - deleteProduct");
        }
    });
}
startRouter();
module.exports = router;