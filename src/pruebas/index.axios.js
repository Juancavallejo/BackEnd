import axios from "axios";

const baseURL = "http://localhost:8080"

const getallproducts = async()=>{
    try {
        const response = await axios.get(`${baseURL}/allproducts`);
        console.log(response.data);
    } catch (error) {
        console.log(error)
    }
}

const addProduct = async () => {
    try {
        const response = await axios.post (`${baseURL}/products`,{
            title: "Gafas de sol rojas",
            price: 3200,
            thumbnail: "https://i.linio.com/p/7ea60a4a0773bc7acf4085056096c447-product.webp",
        })
        console.log (response.data)
    } catch (error) {
        console.log (error)
    }
}

const deleteProduct = async () => {
    try {
        const response = await axios.delete (`${baseURL}/products/12`)
        console.log (response)
    } catch (error) {
        console.log (error)
    }
}

 getallproducts();
// addProduct()
// deleteProduct()