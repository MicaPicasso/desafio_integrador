import { Router } from 'express';
import {productService} from '../services/factory.js'
import userModel from '../services/dao/mongo/models/user.js';
import productModel from '../services/dao/mongo/models/product.js';


import CustomError from '../services/errors/CustomError.js'
import { generateProductErrorInfo } from '../services/errors/messages/product_creation_error.message.js';
import EErrors from '../services/errors/errors-enum.js';

const router = Router();

// Ruta para obtener todos los productos (con limite)
router.get('/', async(req,res)=>{
    try {
        // Recuperar los parámetros de la consulta
        const { limit = 10, page = 1, sort, query } = req.query;
        
        // Crear el objeto de opciones de paginación
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sort || '-_id', // Ordenar por ID de manera descendente por defecto
        };
        
        // Crear el objeto de consulta para el filtro (query)
        const queryObj = query ? { category: query } : {};

         // Utilizar el método paginate para obtener los productos paginados
        const result = await productModel.paginate(queryObj, options);
        const products= await productService.getAll()
        // Devolver el resultado paginado
        res.json({
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink,
                product: products
            });
           

    } catch (error) {
        console.log(error);
        res.json({
                message: "error",
                error
            })
    }
});


// Ruta para obtener un producto por su id
router.get('/:pid', async(req,res)=>{
    try {
            const { pid } = req.params;
            const product = await productService.getProductById({_id: pid});
            
            if (product) {
                res.json(product);
            } else {
                res.json({ message: 'Producto no encontrado' });
            }
    } catch (error) {
            console.log(error);
            res.json({
                message: "error",
                error
        })
    }
})


// Ruta para agregar un nuevo producto
router.post('/', async(req,res)=>{
    try {
        const {title,description,code,price,stock,category,thumbnails, owner} = req.body;
        
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== 'premium') {
            return res.status(403).json({ error: 'No tienes permiso para crear productos.' });
        }


        if(!title || !description || !code || !price || !stock || !category){
            CustomError.createError({
                name: "Product create error",
                cause: generateProductErrorInfo({title,description,code,price,stock,category}),
                message: 'Error tratando de crear el producto y de agregar al carrito',
                code: EErrors.INVALID_TYPE_ERROR
            })
}
            const newProduct ={
                title: title,
                description: description,
                code: code,
                price: Number(price),
                status: true,
                stock: Number(stock),
                category: category,
                thumbnails: thumbnails,
                owner: owner,
            };

            const response = await productService.createProduct(newProduct);
            res.json({'Producto agregado con exito': response});
        
        } catch (error) {
            console.log(error);
            res.json({
                message: "error",
                error
            })
        }

});

// Ruta para actualizar un producto por su id
router.put('/:pid', async(req,res)=>{
    try {
        const { pid } = req.params;
        const product= req.body

        const updatedProduct = await productService.updateProduct({_id: pid}, product);

        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.json({ message: 'Producto no encontrado' });
        }

    } catch (error) {
        console.log(error);
        res.json({
            message: "error",
            error
        })
    }
});

// Ruta para eliminar un producto por su id
router.delete('/:pid', async(req,res)=>{
    try {
        const { pid } = req.params;
        const deletedProduct = await productService.deleteProduct({_id: pid});
        
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'No tienes permiso para eliminar productos.' });
        }
        if (deletedProduct) {
            res.json({ message: 'Producto eliminado correctamente' });
        } else {
            res.json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.json({
            message: "error",
            error
        })
    }
});


export default router;

