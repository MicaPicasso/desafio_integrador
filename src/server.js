/* ---------------------------------------------------
                CONFIGURACION DE EXPRESS
-----------------------------------------------------*/

// server.js
import express from 'express';
import handlebars from 'express-handlebars';
import config from './config/config.js';
import productsRouter from './routes/productsRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionRouter from "./routes/sessionRouter.js"
import userRouter from "./routes/userRouter.js"
import jwtRouter from "./routes/jwt.router.js"
import githubLoginRouter from "./routes/github-loginRouter.js"
import ticketRouter from "./routes/ticket.router.js"
import mockingProductsRouter from "./routes/mockingProducts.router.js"

import __dirname from "./utils.js"
import mongoose from 'mongoose';
import { password, PORT, db_name } from "./env.js"
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
// import program from './process.js'
import MongoSingleton from './config/mongobd-singleton.js'
import { addLogger } from './config/logger_CUSTOM.js';
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'


const server= express()

// Configuración de Handlebars
server.engine('hbs', handlebars.engine({
    extname: "hbs",
    defaultLayout: "home",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));

server.set('view engine', 'hbs');
server.set("views", `${__dirname}/views`)


const swaggerOptions={
    definition:{
        openapi: '3.0.1',
        info: {
            title: 'Docummentacion api adopme',
            description: 'Documentacion para swagger'
        }
    },
    apis: [`./src/docs/**/*.yaml`]
}

const specs= swaggerJSDoc(swaggerOptions)

server.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))



// Middleware para archivos estáticos
server.use(express.static(`${__dirname}/public`));


// Middleware para manejar solicitudes JSON
server.use(express.json());
server.use(express.urlencoded({extended:true}))

// logger
server.use(addLogger)


const MONGO_URL= config.urlMongo
const port= config.port

// Configuracion de Session
server.use(session(  
    {
         // usando filestore
        // store: new fileStore({path:"./sessions", ttl:15, retries:0}),

        // connect mongo
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 10 * 60
        }),
        secret: "coderS3cr3t",
        resave: false,   //guarda en memoria
        saveUninitialized: true //guarda apenas se crea la sesion
    }
))
//Cookies
//router.use(cookieParser());
server.use(cookieParser("CoderS3cr3tC0d3"));

// middleware de passport
initializePassport();
server.use(passport.initialize());
// server.use(passport.session());




// Rutas
server.use('/api/products', productsRouter);
server.use('/api/cart', cartRouter);
server.use('/', viewsRouter);
server.use("/api/session", sessionRouter)
server.use("/api/user", userRouter)
server.use("/github", githubLoginRouter)
server.use("/api/jwt", jwtRouter)
server.use("/api/ticket", ticketRouter)
server.use("/api/mockingProducts", mockingProductsRouter)





// endpoint logger
server.get("/loggerTest", (req,res)=>{
    req.logger.warning('Prueba de log level warn --> en endpoint')

    res.send('Prueba de logger!')
})

// Conectar a la base de datos MongoDB
// mongoose.connect(
//     `mongodb+srv://micapicasso:${password}@cluster0.boiyenp.mongodb.net/${db_name}?retryWrites=true&w=majority`)
//     .then(() => {
//         console.log('Conexión exitosa a MongoDB');
        // console.log(process);

        // excluir los argv por defecto ---- CLASE 25
        // console.log(process.argv.slice(2));
        // const args= process.argv.slice(2)

        // Iniciar el servidor una vez conectado a la base de datos
        server.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto: ${port}`);
            // console.log(process);
            // process.exit(5)
        });

    // })
    // .catch(error => {
    //     console.error('Error al conectar a MongoDB:', error);
    // });


    // const mongoInstance = async () => {
    //     try {
    //         await MongoSingleton.getInstance()
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // mongoInstance();