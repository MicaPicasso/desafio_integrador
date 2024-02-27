import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
    code: { 
        type: String, 
        unique: true, 
        required: true 
    },
    purchase_datetime: { 
        type: Date, 
        default: Date.now 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    purchaser: { 
        type: String, 
        required: true 
    },
});

ticketSchema.pre('save', function (next) {
    // Generar código único utilizando Math.random() y toString(36)
    const randomCode = Math.random().toString(36).substring(2, 10);

    // Asignar el código generado
    this.code = randomCode;
    
    next();
});

const ticketModel = model('Ticket', ticketSchema);

export default ticketModel;

