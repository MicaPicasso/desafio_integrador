import path from "path"
import { fileURLToPath } from "url"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from "passport"

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




export default __dirname
