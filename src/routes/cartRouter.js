import { Router } from 'express';
import { cartService } from '../services/factory.js';
import productModel from '../services/dao/mongo/models/product.js';
import userModel from '../services/dao/mongo/models/user.js';

const router = Router();

// crear un carrito
router.post('/', async(req,res)=>{
    try {
        const newCart = await cartService.createCart({ products: [] });
        res.json(newCart);

    } catch (error) {
        console.log(error);
        res.json({
            message: "error",
            error
        })
    }
})

// traer un carrito segun su id
router.get('/:cid', async(req,res)=>{
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById({_id: cid});
        res.json(cart);
    } catch (error) {
        console.log(error);
        res.json({
            message: "error",
            error
        })
    }
});



// agregar un producto al carrito
router.post('/:cid/product/:pid', async(req,res)=>{
    try {
        const { cid, pid } = req.params;

         // Verificar si el usuario es premium
         const user = await userModel.findOne({ email: email });
         if (!user || user.role === 'premium') {
             // Si el usuario es premium, verificar si el producto pertenece al usuario
             const product = await productModel.findById(pid);
             if (!product || product.owner === email) {
                 return res.status(403).json({ error: 'No puedes agregar tu propio producto al carrito.' });
             }
         }

        const cart = await cartService.getCartById({_id: cid});

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(product => String(product.product._id) == pid);

        // console.log(existingProductIndex);
        if (existingProductIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, agrégalo con una cantidad de 1
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }
        
            // Devolver el carrito actualizado
            const updatedCart = await cartService.getCartByIdandUpdate({_id: cid}, cart);
            
            res.json(updatedCart);

        } catch (error) {
            console.log(error);
            res.json({
                message: "error",
                error
            })
        }
    });


// eliminar un producto del carrito
router.delete('/:cid/product/:pid', async(req,res)=>{
    try {
        const { cid, pid } = req.params;

        // Lógica para eliminar un producto del carrito
        const cart = await cartService.getCartById({_id: cid});
        if (!cart) {
            return res.json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(product => String(product.product._id) == pid);
        if (productIndex !== -1) {
            cart.products.splice(productIndex, 1);
            await cart.save();
            res.json({ message: 'Producto eliminado del carrito' });
        } else {
            res.json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.log(error);
            res.json({
                message: "error",
                error
            })
    }
});

// eliminar todos los productos del carrito
router.delete('/:cid', async(req,res)=>{
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById({_id:cid});

        // Limpiar todos los productos del carrito
        cart.products = [];
        await cart.save();

        // Devolver el carrito vacío
        const emptyCart = await cartService.getCartById({_id:cid});
        res.json(emptyCart);
    } catch (error) {
        console.log(error);
        res.json({
            message: "error",
            error
        })
    }
})


export default router;


