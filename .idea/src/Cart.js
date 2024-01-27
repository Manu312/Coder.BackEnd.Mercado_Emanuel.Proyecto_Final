class Cart{
    id;
    products;
    constructor(products) {
        this.id = 0;
        this.products = products || [];
    }
    getId(){
        return this.id;
    }
    setId(id){
        this.id = id;
    }
    getProductsJSON(){
        return JSON.stringify(this.products);
    }
    getProducts(){
        return this.products;
    }
    setProducts(products){
        this.products = products;
    }
    async vaciarCarrito(){
        await this.products = [];
        return this.products;
    }
    async existeProducto(id){
        return this.products.some((p) => p.id === id);
    }
    async addProduct(id,quantity){
        if(existeProducto(id)) {
            await this.products[id].quantity += quantity;
        }else{
            await this.products.push({id,quantity});
        }
    }
    async removeProduct(id){
        await this.products.splice(id,1);
    }
    async removeProductQuantiy(id,quantity){
        await this.products[id].quantity -= quantity;
    }
}
module.exports = Cart;