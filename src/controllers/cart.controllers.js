import { cartService } from "../services/factory.js";

export async function getAllCarts(req, res) {
    try {
        let cart = await cartService.getAll();
        res.send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los carritos." });
    }
}


export async function saveCart(req, res) {
    try {
        let result = await cartService.save(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el carrito." });
    }
}