import {generateProducts} from '../utils.js'

export const getProducts = async (req,res)=>{
    try{
        let products=[];
        for ( let i=0; i< 100; i++){
            products.push(generateProducts());
        }
        res.send({status: "sucess", payload: products})
    }catch(error){
        console.log(error);
        res.status(500).send({error: error, message: 'No se pudieron obtener los productos'})
    }

}
