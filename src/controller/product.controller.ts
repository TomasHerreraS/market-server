import { Request, Response } from 'express';
import pool from '../db/db';


export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM product');
    // Convertir los datos binarios de la imagen a base64
    result.rows.forEach(product => {
      product.image = Buffer.from(product.image).toString('base64');
    });
    // Enviar los datos actualizados de los productos al cliente
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
}

export const getQuantity = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT quantity FROM product');
    const quantityValue = result.rows[0]?.quantity; // Obtener el valor de la cantidad, si existe

    if (quantityValue !== undefined) {
      res.json(quantityValue.toString()); // Enviar el valor como una cadena
    } else {
      res.status(404).send('No se encontró ninguna cantidad disponible');
    }

  } catch (error) {
    console.error(error);
  }
}