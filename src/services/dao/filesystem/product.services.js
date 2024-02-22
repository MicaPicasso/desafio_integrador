import productModel from '../filesystem/models/product.js';


export default class ProductDao {
    constructor(){
        console.log("Working product with Database persistence in mongodb");
    }
    
    getAll = async () => {
        let products = await productModel.find();
        return products.map(product => product.toObject());
    }
    
    getProductById= async (id)=> {
        let result = await productModel.findById(id)
        return result
    }

    createProduct= async (product)=>{
        let result= await productModel.create(product)
        return result
    }

    updateProduct= async (id, product)=>{    
        return await productModel.findByIdAndUpdate(id,product)
    }

    deleteProduct= async (id)=>{
        return await productModel.findByIdAndDelete(id)
    }
}
