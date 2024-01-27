const express = require("express");
const ProductManager = require("./ProductManager");
const Product = require("./Product");
const productsRoutes = require("./routes/products.routes");
const cartsRoutes = require("./routes/carts.routes");
const API_BASE_PATH = '/api';
const API_VERSION = '/v1';
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const startServer = async () => {
    app.use(`${API_BASE_PATH}${API_VERSION}/products`, productsRoutes);
    app.use(`${API_BASE_PATH}${API_VERSION}/carts`, cartsRoutes);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}
startServer();
