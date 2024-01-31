
import cartModel from '../models/cartModel.js';


class CartDao {
    async createCart(cart){
        return await cartModel.create(cart)
    }

    async getCartById(id){
        return await cartModel.findById(id).populate('products.product')
    }

    async getCartByIdandUpdate(id,cart){
        return await cartModel.findByIdAndUpdate(id,cart)
    }
}

export default new CartDao();





