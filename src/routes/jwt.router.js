import { Router } from "express";
import userModel from "../services/dao/mongo/models/user.js";
import MailingService from "../services/email/mailing.js";
import UserService from "../services/dao/mongo/user.services.js";
import { isValidPassword } from "../utils.js";
import { generateJWToken } from "../utils.js";
import passport from "passport";
import { userService } from "../services/factory.js";

const router = Router()

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

router.get("/githubcallback", passport.authenticate('github', { session: false, failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    // req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age
    // };
    // req.session.admin = true;
    // res.redirect("/users");

       // conJWT 
       const tokenUser = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: user.role
    };
    const access_token = generateJWToken(tokenUser);
    console.log(access_token);

    res.cookie('jwtCookieToken', access_token,
        {
            maxAge: 60000,
            httpOnly: true //No se expone la cookie
            // httpOnly: false //Si se expone la cookie

        }

    )
    res.redirect("/api/user");

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
            console.warn("User doesn't exists with username: " + email);
            return res.status(204).send({ error: "Not found", message: "Usuario no encontrado con username: " + email });
        }
        if (!isValidPassword(user, password)) {
            console.warn("Invalid credentials for user: " + email);
            return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        }
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        console.log(access_token);
        //1ro con LocalStorage
        // res.send({ message: "Login successful!", jwt: access_token });


        // 2do con Cookies
        res.cookie('jwtCookieToken', access_token,
            {
                maxAge: 60000,
                // httpOnly: true //No se expone la cookie
                // httpOnly: false //Si se expone la cookie

            }

        )
        res.send({ message: "Login success!!" })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });
    }

});

// Register
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    const {email, first_name} = req.body


    const user = await userModel.findOne({ email: email });
    console.log(user);
    const miCorreo={
        from: 'CoderTests',
        to: user.email,
        subject:'Te has registrado con exito',
        html: `<div><h1>Felicidades! ${user.first_name}</h1><p>Gracias por registrarte con nosotros!!</p></div>`
    }

    const mailingService= new MailingService();
    const correo= await mailingService.sendSimpleMail(miCorreo)

    res.status(201).send({ status: "success", message: "Usuario creado con extito." });
})

// Solicitar restablecimiento de contraseña
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Verificar si el usuario existe
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(404).send({ status: "error", message: "El usuario no existe." });
    }

    // Enviar correo electrónico con enlace para restablecer contraseña
    const resetLink = `http://localhost:8080/api/reset-password`;
    const miCorreo = {
        from: 'CoderTests',
        to: user.email,
        subject: 'Restablecer contraseña',
        html: `<p>Haga clic en el siguiente enlace para restablecer su contraseña: <a href="${resetLink}">Restablecer contraseña</a></p>`
    };

    const mailingService = new MailingService();
    await mailingService.sendSimpleMail(miCorreo);

    res.status(200).send({ status: "success", message: "Correo de restablecimiento de contraseña enviado." });
});




export default router;