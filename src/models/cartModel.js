// cartModel.js
import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    title: String,
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product', // Referencia al modelo de productos
                required: true
            },
            quantity: {
                type: Number,
                default: 1 // Puedes establecer un valor predeterminado según tus necesidades
            }
        }
       ]
});


const cartModel = model('Cart', cartSchema);

export default cartModel;
