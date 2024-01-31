import { Router } from "express";
import { authToken } from "../utils.js";
import userModel from "../models/userModel.js";
import passport from "passport";
import { passportCall, authorization } from "../utils.js";


const router=Router()

router.get("/login", (req, res) => {
    res.render('login')
})

router.get("/register", (req, res) => {
    res.render('register')
})

router.get("/",
    // authToken, //-> Usando Authorization Bearer Token
    // passport.authenticate('jwt', { session: false }), //-> Usando JWT por Cookie
    passportCall('jwt'), //-> Usando passport-JWT por Cookie mediante customCall
    authorization('user'),
    (req, res) => {
        res.render("profile", {
            user: req.user
        });
    }
);


router.get("/:userId", authToken,
async(req,res)=>{
    const userId= req.params.userId;
    try{
        const user= await userModel.findById(userId);
        if(!user){
            res.status(202).json({message: 'Usuario no encontrado con ID: ' + userId})
        }
        res.json(user);
    }catch(error){
        console.error('error consultando el usuario con ID:' + userId)
    }
})



export default router;