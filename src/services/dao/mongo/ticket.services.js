import nodemailer from 'nodemailer'
import config from '../../../config/config.js';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    },
});

export const sendTicketByEmail = async (ticket) => {
    const mailOptions = {
        from: 'Servidor '+ config.gmailAccount,
        to: ticket.purchaser,
        subject: 'Detalle de tu compra',
        text: `Código del Ticket: ${ticket.code}\nFecha de Compra: ${ticket.purchase_datetime}\nTotal de la Compra: ${ticket.amount}`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};


