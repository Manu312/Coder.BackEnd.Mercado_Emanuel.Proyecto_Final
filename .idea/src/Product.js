class Product {
    id;
    title;
    description;
    price;
    thumbnail;
    code;
    stock;
    constructor(title, description, price, status, thumbnail, code, stock, category) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.status = true || status;
        this.code = code;
        this.stock = stock;
        this.category = category || "";
        this.id = 0;
    }
    getStock() {
        return this.stock;
    }
    setStock(stock) {
        this.stock = stock;
    }
    getPrice() {
        return this.price;
    }
    setPrice(price) {
        this.price = price;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    setId(id) {
        this.id = id;
    }
}
module.exports = Product;