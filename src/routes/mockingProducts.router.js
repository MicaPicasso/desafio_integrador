import { Router } from 'express';
import {getProducts} from '../controllers/mocking_products.controllers.js'


const router = Router();

router.get("/", getProducts);

export default Router

