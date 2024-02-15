import mongoose from "mongoose";
import {password, db_name} from '../env.js'

class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }


    // implementacion del singleton
    static getInstance(){
        if(this.#instance){
            console.log('Ya se ha abierto una conexion a MongoDB');
        }else{
            this.#instance = new MongoSingleton();
        }
        return this.#instance
    }


    #connectMongoDB = async()=>{
        try{
            await mongoose.connect(`mongodb+srv://micapicasso:${password}@cluster0.boiyenp.mongodb.net/${db_name}?retryWrites=true&w=majority`)
            console.log('Conectado con exito a MongoDb usando Mongoose');
        }catch(error){
            console.error('No se pudo conectar')
            process.exit()
        }
    }
}

export default MongoSingleton