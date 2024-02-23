import nodemailer, {Transporter, SendMailOptions, SentMessageInfo} from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

// Configuración del transporter (servidor SMTP)
export const transporter: Transporter  = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.USER_NODEMAILER, // Tu dirección de correo
    pass: process.env.PASS_NODEMAILER// Tu contraseña de correo
  }
});