import dotenv from 'dotenv'

const enviroment= "production"


dotenv.config({
    path: enviroment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})

export default{
    port: process.env.PORT,
    urlMongo: process.env.MONGO_URL,
}