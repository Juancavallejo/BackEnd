
class ContenedorMock {
    constructor() {
        this.products = []
    }

    getAll () {
        return this.products
    }

    saveFakeProducts = (newProduct) => {
        this.array.push(newProduct)
        return newProduct;
    }
}

export default ContenedorMock