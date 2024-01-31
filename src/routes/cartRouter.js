import { Router } from 'express';
import cartDao from '../dao/cart.dao.js';

const router = Router();

// crear un carrito
router.post('/', async(req,res)=>{
    try {
        const newCart = await cartDao.createCart({ products: [] });
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
        const cart = await cartDao.getCartById({_id: cid});
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
        const cart = await cartDao.getCartById({_id: cid});

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
            const updatedCart = await cartDao.getCartByIdandUpdate({_id: cid}, cart);
            
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
        const cart = await cartDao.getCartById({_id: cid});
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
        const cart = await cartDao.getCartById({_id:cid});

        // Limpiar todos los productos del carrito
        cart.products = [];
        await cart.save();

        // Devolver el carrito vacío
        const emptyCart = await cartDao.getCartById({_id:cid});
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


