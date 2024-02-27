import { Router } from "express";
import { createTicket } from "../controllers/ticket.controllers.js";



const router = Router();


router.post('/', createTicket);


export default router;







