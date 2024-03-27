import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import pool from '../db/db';
import dotenv from 'dotenv';
import { SendMailOptions, SentMessageInfo} from 'nodemailer';
import { transporter } from '../utils/nodemailer';

dotenv.config();
let globalRandomNumber: number | null = null;

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT * FROM "user"');
    res.status(200).json(response.rows);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
 const { email } = req.body;
  try {
    const response = await pool.query('DELETE FROM "user" WHERE email = $1;', [email])
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const sendEmail = async (req: Request, res: Response) => {
  const { email, firstname } = req.body;
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
        <p>Este es el código de verificación: ${globalRandomNumber}</p>
      </div>
    `
  };

  try {
    // Enviar el correo electrónico
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent correctly');
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
  const { firstname, lastname, role_id, email, password, phone, state, city, address } = req.body;
  const date : Date = new Date();
  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    await pool.query('INSERT INTO "user" ("firstname", "lastname", "role_id", "email", "password", "phone", "state", "city", "address", "date") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [firstname, lastname, role_id, email, hashedPassword, phone, state, city, address, date]);

    res.json({ firstname, lastname, email, phone, state, city, address });
  } catch (error) {
    console.error('Error al crear usuario o enviar correo: ', error);
    res.status(500).json({ error: 'Error al crear usuario o enviar correo electrónico' });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const result = await pool.query('SELECT * FROM "user" WHERE email = $1 AND password = $2', [email, hashedPassword]);
    if (result.rows.length === 1) {
      // Usuario autenticado, generamos un token JWT
      if (process.env.JWT_SECRET_KEY) { // Validamos que existe la key dentro del env
        const user = result.rows[0];
        const token = jwt.sign({ userId: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
      }

    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Failed to login: ', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const getRole = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT role_id FROM "user" WHERE email = $1', [email])
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
  }
}

export const getUserId = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT user_id FROM "user" WHERE email = $1', [email])
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to get user id" });
  }
}

export const getUniques = async (req: Request, res: Response) => {
  try {
    const response = await pool.query('SELECT PHONE, EMAIL FROM "user"');
    res.status(200).json(response.rows); // Envía los datos como respuesta
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getCheckExists = async (req: Request, res: Response) => {
  const { phone, email } = req.body;
  try {
    const result = await pool.query('SELECT phone, email FROM "user" WHERE phone = $1 OR email = $2', [phone, email]);
    if (result.rows.length > 0) {
      const exists = {
        email: false,
        phone: false
      };
      result.rows.forEach((user) => {
        if (user.email === email) {
          exists.email = true;
        }
        if (user.phone === phone) {
          exists.phone = true;
        }
      });
      res.status(200).json(exists);
    } else {
      res.status(200).json({ email: false, phone: false });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};