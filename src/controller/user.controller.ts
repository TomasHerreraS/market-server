import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../db/db';
import dotenv from 'dotenv';
import { SendMailOptions, SentMessageInfo} from 'nodemailer';
import { transporter } from '../utils/nodemailer';

dotenv.config();
let globalRandomNumber: number | null = null;

export const getAllUser = async () => {
  try {
    const response = await pool.query('SELECT * FROM users');
    return response.rows;
  } catch (error) {
    console.log(error);
    throw error; // Asegúrate de propagar el error para manejarlo adecuadamente en otro lugar si es necesario
  }
};

export const sendEmail = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (globalRandomNumber !== null) {
    globalRandomNumber = null;
  }

  const min = 10000;
  const max = 99999;
  globalRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min; // Genera el número aleatorio si aún no está definido
  // TODO: BORRAR EL RANDOMNUMBER QUE QUEDE IWAL AL MODALMAILVALIDATION
  // Detalles del correo electrónico
  const mailOptions: SendMailOptions = {
    from: process.env.USER_NODEMAILER,
    to: email,
    subject: 'Quantum Halo validate Email',
    html: `
      <div style="border-radius: 5px; border: 1px solid black; background-color: #f0f0f0; padding: 20px;">
        <p>¡Hola!</p>
        <p>Este es el código de verificación: ${globalRandomNumber}</p>
      </div>
    `
  };

  try {
    // Enviar el correo electrónico
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    res.status(200).send('Email send correctly');
    console.log('Correo electrónico enviado: ' + info.response);
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
}

export const deleteGlobalNumber = () => {
  globalRandomNumber = null;
}

export const verificationCode = async(req: Request, res: Response) => {
  const { verificationCode } = req.body;
  try {
    console.log(globalRandomNumber, verificationCode)
    if (globalRandomNumber?.toString() === verificationCode) {
      res.status(200).send('Verified code');
      deleteGlobalNumber();
    } else if (globalRandomNumber === null) {
      res.status(404).send('Verification code was not found');
    } else if (globalRandomNumber?.toString() !== verificationCode) {
      res.status(400).send('Invalid code')
    }
  } catch (error) {
    console.error('Ocurrió un error: ', error)
  }
}

export const addUser = async (req: Request, res: Response) => {
  const { name, lastname, rol_id, email, password, phone, state, city, address } = req.body;
  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    await pool.query('INSERT INTO users ("name", "lastname", "rol_id", "email", "password", "phone", "state", "city", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [name, lastname, rol_id, email, hashedPassword, phone, state, city, address]);

    res.json({ name, lastname, email, phone, state, city, address });
  } catch (error) {
    console.error('Error al crear usuario o enviar correo: ', error);
    res.status(500).json({ error: 'Error al crear usuario o enviar correo electrónico' });
  }
};

export const getUniques = async (req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT PHONE, EMAIL FROM users');
    res.status(200).json(response.rows); // Envía los datos como respuesta
  } catch (error) {
    res.status(500).json({ error: error });
  }
};