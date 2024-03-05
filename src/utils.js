import path from "path"
import { fileURLToPath } from "url"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport"
import {faker} from '@faker-js/faker'

const __filename= fileURLToPath(import.meta.url)
const __dirname= path.dirname(__filename)


// bcrypt
// creacion del hash
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// validacion
export const isValidPassword=(user, password)=>{
    console.log(`Datos a validar: user-password: ${user.password}, password: ${password}`);
    return bcrypt.compareSync(password, user.password)
}

// JWT
export const PRIVATE_KEY= "CoderhouseSecretKeyJWT";

/**
 * Generar el token JWT usando jwt.sign
 * Primer argumento: objeto a cifrar dentro del JWT
 * Segundo argumento: llave privada a firmar el token
 * Tercer argumento: tiempo de expiracion del token
 */

export const generateJWToken= (user)=>{
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'})
}

// funcion que autentica y valida si ese token es valido

export const authToken = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    console.log('Token present in header auth');
    console.log(authHeader);

    if(!authHeader){
        return res.status(401).send({error: 'usuario no autenticado o token perdido'})
    }

    const token= authHeader.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error,credentials)=>{
        if(error) return res.status(403).send({error: 'token invalid'})

        // token is ok
        req.user= credentials.user;
        console.log(req.user);
        next();
    })
}
// para manejo de errores
export const passportCall = (strategy) => {
    return async (req, res, next) => {
        console.log("Entrando a llamar strategy: ");
        console.log(strategy);
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            }
            console.log("Usuario obtenido del strategy: ");
            console.log(user);
            req.user = user;
            next();
        })(req, res, next);
    }
};


// para manejo de Auth
export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send("Unauthorized: User not found in JWT")

        if (req.user.role !== role) {
            return res.status(403).send("Forbidden: El usuario no tiene permisos con este rol.");
        }
        next()
    }
};

// faker
faker.locale = 'es'; //Idioma de los datos
export const generateProducts = () => {
    let numOfProducts = parseInt(faker.random.numeric(1, { bannedDigits: ['0'] }));
    // Crear una lista de roles posibles
    let products = [];
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProduct());
    }
    return products
};

export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.string.numeric(1),
        id: faker.database.mongodbObjectId(),
        thumbnails: faker.image.url(),
        category: faker.commerce.productAdjective()
    }
};

export default __dirname;


// export const generateProducts = () => {
//     let numOfProducts = parseInt(faker.string.numeric(1, { bannedDigits: ['0'] }));
//     let products = [];
//     for (let i = 0; i < numOfProducts; i++) {
//         products.push(generateProduct());
//     }
//     // return {
//     //     name: faker.firstName(),
//     //     last_name: faker.lastName(),
//     //     sex: faker.sex(),
//     //     birthDate: faker.birthdate(),
//     //     products: products,
//     //     id: faker.database.mongodbObjectId(),
//     //     email: faker.internet.email(),
//     //     rol: roles[Math.floor(Math.random() * roles.length)]
//     // };
//     return products
    
// };
   
// export const generateProduct = () => {
//     return {
//         title: faker.commerce.productName(),
//         description: faker.commerce.productDescription(),
//         price: faker.commerce.price(),
//         stock: faker.string.numeric(1),
//         id: faker.database.mongodbObjectId(),
//         thumbnails: faker.image.url(),
//         category: faker.commerce.productAdjective()
//     }
// };

// // En utils.js
// // export const generateProducts = () => {
// //     let numOfProducts = parseInt(faker.datatype.number(1).toString(), 10);
// //     let products = [];
// //     for (let i = 0; i < numOfProducts; i++) {
// //         products.push({
// //             title: faker.commerce.productName(),
// //             description: faker.commerce.productDescription(),
// //             price: faker.commerce.price(),
// //             stock: faker.datatype.number(1).toString(),
// //             id: faker.datatype.uuid(),
// //             thumbnails: faker.image.imageUrl(),
// //             category: faker.commerce.productAdjective()
// //         });
// //     }
// //     return products;
// // };







// export default __dirname
