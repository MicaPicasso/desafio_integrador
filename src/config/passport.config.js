import passport from "passport";
import passportLocal from "passport-local"
import userModel from "../models/userModel.js";
import { createHash } from "../utils.js";
import GitHubStrategy from "passport-github2";
import jwtStrategy from 'passport-jwt';
import {PRIVATE_KEY} from '../utils.js'



    // declaracion estrategia
 const localStrategy = passportLocal.Strategy;


const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;


// inicializacion de passport
const initializePassport= ()=>{
    
    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                //Validamos si el user existe en la DB
                const exist = await userModel.findOne({ email });
                if (exist) {
                    console.log("El user ya existe!!");
                    done(null, false)
                }

                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    // password //se encriptara despues...
                    password: createHash(password),
                    loggedBy: 'form'
                }
                const result = await userModel.create(user);
                console.log(result);
                // Todo sale ok
                return done(null, result)
            } catch (error) {
                return done(error)
            }
        }
    ));

    // // estrategia de login
    // passport.use('login', new localStrategy(
    //     {passReqToCallback: true, usernameField: 'email'},
    // async(req,username,password,done)=>{
    //     try{
    //         const user= await userModel.findOne({email: username})
    //         if(!user){
    //             console.warn('User no existe' + username)
    //             return done(null,false)
    //         }

    //         if(!isValidPassword(user,password)){
    //             console.warn('Credenciales invalidas')
    //             return done(null,false)
    //         }
    
    //         return done(null,user)

    //     }catch(error){
    //         return done('Error de login' + error)
    //     }
    // }
    // ))
    

    // estrategia de obtener el token jwt por cookie:
       passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: PRIVATE_KEY
        }, async (jwt_payload, done) => {
            console.log("Entrando a passport Strategy con JWT.");
            try {
                console.log("JWT obtenido del Payload");
                console.log(jwt_payload);
                return done(null, jwt_payload.user)
            } catch (error) {
                return done(error)
            }
        }
    ));

    // passport.use('jwt-current', new JwtStrategy(
    // {
    //     jwtFromRequest: cookieExtractor,
    //     secretOrKey: PRIVATE_KEY
    // }, async (payload, done) => {
    //     // Aquí puedes realizar la lógica para obtener el usuario asociado al token (payload)
    //     // por ejemplo, puedes consultar la base de datos con el ID del usuario en payload.sub
    //     await userModel.findById(payload.sub, (err, user) => {
    //         if (err) return done(err, false);
    //         if (user) {
    //             return done(null, user);
    //         } else {
    //             return done(null, false);
    //         }
    //     });
    // }));

        // estrategia de github
     passport.use('github', new GitHubStrategy(
        {
            clientID: "Iv1.6559fb38e348b829",
            clientSecret: "04e1f90b635b72ba10117b09aa9457f3878d96ca",
            callbackUrl: "http://localhost:8080/session/githubcallbacks"
            
        },
    async(accessToken, refreshToken, profile, done)=>{
        console.log("Profile obtenido del usuario de Git:");
        console.log(profile);
        try{
            const user= await userModel.findOne({email: profile._json.email})
            console.log("Usuario encontrado para login");
            console.log(user);

            if(!user){
                console.warn("Usuario no encontrado")
                let newUser={
                    first_name: profile._json.name,
                    last_name: '',
                    age:18,
                    email: profile._json.email,
                    password: '',
                    loggedBy: 'GitHub',
                }
                const result= await userModel.create(newUser)
                return done(null,result)
            }else{
                return done(null,user)
            }
        }catch(error){
            return done('Error de login' + error)
        }
    }
    ))
    



    // funciones de serializacion y deserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
}


const cookieExtractor = req => {
    let token = null;
    console.log("Entrando a Cookie Extractor");
    if (req && req.cookies) {//Validamos que exista el request y las cookies.
        console.log("Cookies presentes: ");
        console.log(req.cookies);
        token = req.cookies['jwtCookieToken']
        console.log("Token obtenido desde Cookie:");
        console.log(token);
    }
    return token;
};


export default initializePassport;
