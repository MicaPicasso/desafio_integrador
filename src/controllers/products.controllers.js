// Para trabajar Repository
import { productService } from '../services/factory.js';
import StudentsDto from '../services/dto/student.dto.js';

export async function getAllProducts(req, res) {
    try {
        let products = await productService.getAll();
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo obtener los estudiantes." });
    }
}


export async function saveProducts(req, res) {
    try {
        const studentDto = new StudentsDto(req.body);
        let result = await productService.save(studentDto);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo guardar el estudiante." });
    }
}