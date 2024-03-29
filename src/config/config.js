import dotenv from 'dotenv'
import { Command } from 'commander';

const program = new Command();

program
    .option('-d', 'Varaible para debug', false) //primero va la variable, luego la descripcion y al final puede ir un valor por defecto.
    .option('-p <port>', 'Puerto del servidor', 8080)
    .option('--persist <persist>', 'Modo de persistencia', 'mongodb')
    .option('--mode <mode>', 'Modo de trabajo', 'develop')

    .requiredOption('-u <user>', 'Usuario que va a utilizar el aplicativo.', 'No se ha declarado un usuario.');//RequireOption usa un mensaje por defecto si no está presente la opción.
program.parse(); //Parsea los comandos y valida si son correctos.


console.log("Enviroment Mode Options: ", program.opts().mode);
console.log('Persistence Mode Option:', program.opts().persist);
console.log("Remaining arguments: ", program.args);

// 2do - Listeners
process.on("exit", code => {
    console.log("Este codigo se ejecuta antes de salir del proceso.");
    console.log("Codigo de salida del proceso: " + code);
});

process.on("uncaughtException", exception => {
    console.log("Esta exception no fue capturada, o controlada.");
    console.log(`Exception no capturada: ${exception}`)
});

process.on("message", message => {
    console.log("Este codigo se ejecutará cuando reciba un mensaje de otro proceso.");
    console.log(`Mensaje recibido: ${message}`);
});

const enviroment= program.opts().mode;


dotenv.config({
    path: enviroment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})

// console.log(process.env.MONGO_URL);


export default{
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
    persistence: program.opts().persist,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    enviroment:enviroment
}