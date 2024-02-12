import { Request, Response } from 'express';
import pool from '../db/db';
import { io } from '../index';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM product ORDER BY product_id ASC;');
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
    const result = await pool.query('SELECT product_id, quantity FROM product ORDER BY product_id ASC');
      res.json(result.rows); // Enviar el valor como una cadena
  } catch (error) {
    console.error(error);
  }
}

export const buyProduct = async (req: Request, res: Response) => {
  try {
    const { product_id } = req.body;
    const result = await pool.query('UPDATE product SET quantity = quantity - 1 WHERE product_id = $1', [product_id]);
    // Emitir evento 'quantityUpdated' al cliente cuando se actualice la cantidad
    io.emit('quantityUpdated');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al realizar la compra' });
  }
}