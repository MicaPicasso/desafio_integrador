import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnails: String,
    owner: {
        type: String,
        default: 'admin', // Valor predeterminado si no se proporciona el propietario
        required: true
    }
});

productSchema.plugin(mongoosePaginate);

const productModel = model('Product', productSchema);

export default productModel;