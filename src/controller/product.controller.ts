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

  export const deleteProduct = async (req: Request, res: Response) => {
    const { product_id } = req.body;
    try {
      await pool.query('DELETE FROM product WHERE product_id = $1;', [product_id])
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch(error) {
      console.log(error);
      res.status(500).json({ error: "Error trying to delete product" })
    }
  }

  export const addProduct = async (req: Request, res: Response) => {
    const { name, quantity, description, discount, price, images, category, brand } = req.body;
    const release_date = new Date();
    try {
      await pool.query('INSERT INTO product("name", "release_date", "quantity", "description", "discount", "price", "images", "category", "brand") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);',
      [name, release_date, quantity, description, discount, price, images, category, brand])
      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      res.status(500).json({ error: "Error trying to add product" })

    }
  }

  export const updateProduct = async (req: Request, res: Response) => {
    const { column, newData, product_id } = req.body;
    try {
      await pool.query(`UPDATE product SET ${column} = ${newData}  WHERE product_id = $1`,[product_id]);
      res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: "Error trying to update product" })
    }
  }

  export const getProductById = async (req: Request, res: Response) => {
    const { product_id } = req.body;
    try {
      const result = await pool.query('SELECT * FROM product WHERE product_id = $1',[product_id])
      result.rows.forEach(product => {
        product.images = product.images.map((image: Buffer) => Buffer.from(image).toString('base64'));
        res.json(result)
      });
    } catch (error) {
      res.status(500).json({ error: "Error trying to find product" })
    }
  }
