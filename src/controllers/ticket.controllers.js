import __dirname from '../utils.js'
import ticketModel from '../services/dao/mongo/models/ticket.js';
import { sendTicketByEmail } from '../services/dao/mongo/ticket.services.js';


export const createTicket = async (req, res) => {
    try {
        const newTicket = new ticketModel({
            code: generateUniqueCode(),
            amount: req.body.amount,
            purchaser: req.body.purchaser,
        });

        const savedTicket = await newTicket.save();

        res.status(201).json(savedTicket);

        await sendTicketByEmail(savedTicket);
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Función para generar un código único para el ticket
const generateUniqueCode = () => {
    const randomCode = Math.random().toString(36).substring(2, 8);
    return randomCode;
  };
  
