import cartModel from './models/cart.js';


export default class CartDao {
    constructor(){
        console.log("Working cart with Database persistence in mongodb");
    }
    
    createCart= async (cart)=>{
        return await cartModel.create(cart)
    }

    getCartById= async (id)=>{
        return await cartModel.findById(id).populate('products.product')
    }

    getCartByIdandUpdate= async (id,cart)=>{
        return await cartModel.findByIdAndUpdate(id,cart)
    }

}






