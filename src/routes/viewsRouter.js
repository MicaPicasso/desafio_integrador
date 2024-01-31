import { Router } from "express";
import productDao from "../dao/product.dao.js";
import cartDao from "../dao/cart.dao.js";

const router= Router()

router.get("/", (req,res)=>{
     res.render("index",{
        //  style: 'style.css'
    }
    )
})


router.get("/products", async (req,res)=>{
    const products= await productDao.getAllProducts()
    res.render('products',{
        products,
        // style: 'style.css'
    })
})


router.get("/cart/:cid", async (req,res)=>{
    try{
        const {cid}= req.params
        const cart= await cartDao.getCartById({_id: cid})
        const productsinCart= cart.products
            res.render('cart',{
                cart,
                productsinCart
         })

        console.log(productsinCart);
    }catch(error){
        console.error(error);       
    }
    
})

export default router