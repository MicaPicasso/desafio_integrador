import { Router } from "express"
import userModel from "../models/userModel.js"
import {createHash, generateJWToken, isValidPassword} from '../utils.js'
import passport from "passport";

const router=Router();

// rutas de session

// router.get("/", (req,res)=>{
//     if(req.session.counter){
//         req.session.counter ++
//         res.send(`Se ha visitado este sitio ${req.session.counter} veces`)
//     }else{
//         req.session.counter = 1
//         res.send("Bienvenido")
//     }
// })



// // salir de la sesion
// router.get("/logout", (req,res)=>{
//     req.session.destroy(error =>{
//         if(error){
//             res.json({error: "Error al cerrar la sesión"})
//         }
//         res.send('Sesion cerrada con exito.')
//     })
// })

// // login

// router.get("/login", (req,res)=>{
//     const {username, password}= req.query

//    if(username != 'pepe' || password != "123"){
//     return res.status(401).send("Login failed, check you credentials")
//    }else{
//     req.session.user= username;
//     req.session.admin= true;
//     res.send("Acceso correcto")
//    }
// })

// // middleware auth
// function auth(req,res,next){
//     if(req.session.user === "pepe" && req.session.admin){
//         return next()
//     }else{
//         return res.status(403).send('Usuario no autorizado para ingresar a este recurso')
//     }
// }

// router.get("/private", auth, (req,res)=>{
//     res.send('Si estas viendo esto es porque estas autorizado a este recurso')

// })

// passport github



router.get("/github", passport.authenticate("github", {scope: ['user:email']}),
async(req,res)=>{
    {}
})


router.get("/githubcallbacks", passport.authenticate("github", 
    {failureRedirect: '/github/error'} ), 
    async(req,res)=>{
        const user= req.user;
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
        }
        req.session.admin= true;
        res.redirect("/user")
    })

// passport local

// register

router.post("/register", passport.authenticate('register', {
    failureRedirect: '/api/session/fail-register'
}), async (req,res)=>{
        console.log('registrando usuario');
        res.status(201).send({status: "exitoso", message: 'Usuario creado con exito'})
})

// login
router.post("/login", passport.authenticate('login',{
    failureRedirect: '/api/session/fail-login'
}), async (req,res)=>{
       
    console.log('usuario encontrado');
    const user= req.user
    console.log(user);

        // req.session.user = {
        //     name: `${user.first_name} ${user.last_name}`,
        //     email: user.email,
        //     age: user.age,
        // } 

        const access_token = generateJWToken(user)
        console.log(access_token);
        res.send({access_token: access_token})

        // res.send({status: 'success', payload: req.session.user, message: 'Primer logueo realizado!'})
})

// Ruta para obtener el usuario actual usando JWT
router.get('/current', passport.authenticate('jwt', 
{ session: false }), 
    async (req, res) => {
    res.json({user: req.user});
    
});

router.get('/fail-register', (req,res)=>{
    res.status(401).send({error: 'Error al registrarse'})
})

router.get('/fail-login', (req,res)=>{
    res.status(401).send({error: 'Error al loguearse'})
})
export default router