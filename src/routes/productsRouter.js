import { Router } from 'express';
import productDao from '../dao/product.dao.js'
import productModel from '../models/productsModel.js';

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
            const product = await productDao.getProductById({_id: pid});
            
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
        const {title,description,code,price,stock,category,thumbnails} = req.body;

            const newProduct ={
                title: title,
                description: description,
                code: code,
                price: Number(price),
                status: true,
                stock: Number(stock),
                category: category,
                thumbnails: thumbnails
            };

            const response = await productDao.createProduct(newProduct);
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

        const updatedProduct = await productDao.updateProduct({_id: pid}, product);

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
        const deletedProduct = await productDao.deleteProduct({_id: pid});

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

