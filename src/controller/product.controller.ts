import { Request, Response } from 'express';
import pool from '../db/db';
import { io } from '../index';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT product_id, "name", release_date, quantity, description, category, brand, discount, price, favorite, image[1] AS image,user_id FROM product ORDER BY product_id ASC;');
    // Convertir los datos binarios de la imagen a base64
    result.rows.forEach(product => {
      product.image = Buffer.from(product.image).toString('base64');
    });
    // Enviar los datos actualizados de los productos al cliente
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}

export const getProductLength = async (req: Request, res: Response) => {
  try{
    const result = await pool.query('SELECT COUNT(*) FROM product;');
    res.json(result.rows[0].count);
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}

export const getProductTable = async (req: Request, res: Response) => {
  try{
    const { limit, offset } = req.query;
    const result = await pool.query(`SELECT product_id, "name", release_date, quantity, description, category, brand, discount, price, favorite, image[1] as image, user_id FROM product
    ORDER BY product_id ASC LIMIT $1 OFFSET $2;`, [limit, offset]);
    res.json(result.rows)
  }catch(error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}

export const getQuantity = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT product_id, quantity FROM product ORDER BY product_id ASC');
      res.json(result.rows); // Enviar el valor como una cadena
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
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
    res.status(500).json({ error: 'Error when making purchase' });
  }
}