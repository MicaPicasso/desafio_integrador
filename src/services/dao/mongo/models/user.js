import { Schema, model } from "mongoose";

const userSchema= new Schema({
    first_name: String,
    last_name: String,
    email:{
        type:String,
        unique:true,
    },
    age: Number,
    password: String,
    loggedBy: String,
    cart: {
        type: Schema.Types.ObjectId, 
        ref: 'Cart' 
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin', 'premium'],
    }
})


const userModel = model('users', userSchema);

export default userModel;