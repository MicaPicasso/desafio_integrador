import config from "../config/config.js";
import MongoSingleton from "../config/mongobd-singleton.js";

let productService;
let cartService;
let userService;


async function initializeMongoService(){
    console.log('Iniciando servicio para Mongo');
    try{
        await MongoSingleton.getInstance()
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}

switch (config.persistence) {
    case 'mongodb':
        initializeMongoService()
        // importacion del dao
        const {default: ProductServiceMongo} = await import('./dao/mongo/product.services.js')
        productService = new ProductServiceMongo
        console.log('Servicio de productos cargado');
        console.log(productService);

        const {default: CartServiceMongo} = await import('./dao/mongo/cart.services.js')
        cartService = new CartServiceMongo
        console.log('Servicio para el carrito cargado');
        console.log(cartService);


        const {default: UserServiceMongo} = await import('./dao/mongo/user.services.js')
        userService = new UserServiceMongo
        console.log('Servicio para el carrito cargado');
        console.log(userService);
        break;

    case 'file':
        // importacion del dao
        const {default: ProductServiceFileSystem} = await import('./dao/filesystem/product.services.js')
        productService = new ProductServiceFileSystem
        console.log('Servicio de productos cargado');
        console.log(productService);

        const {default: CartServiceFileSystem} = await import('./dao/filesystem/cart.services.js')
        cartService = new CartServiceFileSystem
        console.log('Servicio para el carrito cargado');
        console.log(cartService);
        
        const {default: UserServiceFileSystem} = await import('./dao/filesystem/user.services.js')
        userService = new UserServiceFileSystem
        console.log('Servicio para el carrito cargado');
        console.log(userService);
        break;
    
    default:
        console.error('Persistencia no valida en la configuracion', config.persistence)
        process.exit(1)
        break;
}


export {productService, cartService, userService}