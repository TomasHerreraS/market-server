import { Request, Response } from 'express';
import pool from '../db/db';
import { io } from '../index';
import fs from 'fs'
import path from 'path'

export const getAllProducts = async (req: Request, res: Response) => {
  const { product_id } = req.body;
  try {
    if (product_id){
      const result = await pool.query('SELECT image1, "name", "quantity", "description", "release_date", "price", "brand", "category","discount", "product_id" FROM product WHERE product_id = ANY($1)', ([product_id]))
      result.rows.forEach(product => {
        product.image1 = Buffer.from(product.image1).toString('base64');
      });
      res.json(result.rows);
    } else {
      const result = await pool.query('SELECT image1, "name", "quantity", "description", "release_date", "price", "brand", "category","discount", "product_id" FROM product;');
      // Convertir los datos binarios de la imagen a base64
      result.rows.forEach(product => {
        product.image1 = Buffer.from(product.image1).toString('base64');
      });
      // Enviar los datos actualizados de los productos al cliente
      res.json(result.rows);
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error trying to fetch all products' });
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
    const { name, discount, quantity, description, price, brand, category } = req.body;
    console.log(req.body); // Check form data received
    const release_date = new Date();
  
    try {
      // Assuming images are uploaded using multer and stored in req.files
      const files = req.files as Express.Multer.File[];
      let image1: Buffer | undefined;
      let image2: Buffer | undefined;
      let image3: Buffer | undefined;
  
      for (let i = 0; i < files.length ; i++) {
        const file = files[i]
        const filePath = path.resolve(__dirname, '..','..', 'uploads', file.filename);
        const fileData = fs.readFileSync(filePath);

        if(i == 0) {
          image1 = fileData;
        }
        else if(i == 1) {
          image2 = fileData;
        } else {
          image3 = fileData;
        }
      }

      // Perform database insertion
      await pool.query(
        'INSERT INTO product("name", "release_date", "quantity", "description", "discount", "price", "category", "brand", "image1", "image2", "image3") VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [name, release_date, quantity, description, discount, price, category, brand, image1, image2, image3]
      );

      for (const file of files) {
        const filePath = path.resolve(__dirname, '..', '..', 'uploads', file.filename);
        fs.unlinkSync(filePath);
      }
  
      res.status(200).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error("Error in addProduct:", error);
      res.status(500).json({ error: "Error trying to add product" });
    }
  };
  
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
        const result = await pool.query('SELECT * FROM product WHERE product_id = $1', [product_id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        result.rows.forEach(product => {
          if(product.image1){
            product.image1 = Buffer.from(product.image1).toString('base64');
          }
          if(product.image2){
            product.image2 = Buffer.from(product.image2).toString('base64');
          }
          if(product.image3){
            product.image3 = Buffer.from(product.image3).toString('base64');
          }
        });
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error trying to find product" });
    }
};

  export const getFavorite = async (req: Request, res: Response) => {
    const { user_id } = req.body;

    try {

      const userExists = await pool.query('SELECT user_id FROM "user" WHERE user_id = $1;', [user_id]);
      if(userExists.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" })
      }

      const favoritesData = await pool.query('SELECT favorite FROM "user" WHERE user_id = $1;', [user_id]);
      const favorites = favoritesData.rows.map(row => row.favorite);

      const result = await pool.query('SELECT "price", "discount", "quantity", "name", "image1" FROM product WHERE product_id = ANY($1)', [favorites])
      result.rows.forEach(product => {
        product.image1 = Buffer.from(product.image1).toString('base64');
      });
      res.status(200).json(result.rows);
      
    } catch (error) {
      res.status(500).json({ error: "Failed to get favorite" })
    }
  }
    
  export const addToFavorite = async (req: Request, res: Response) => {
    const { product_id, user_id } = req.body;

    try {
      
      const productExists = await pool.query('SELECT EXISTS(SELECT 1 FROM product WHERE product_id = $1);', [product_id]);
      if (!productExists.rows[0].exists) {
        return res.status(404).json({ error: "Product does not exist" })
      }
      
      const isInFavorite = await pool.query('SELECT user_id FROM "user" WHERE ($1 = ANY(favorite) AND user_id = $2);', [product_id, user_id]);
      if (isInFavorite.rows.length > 0) {
        return res.status(400).json({ error: "Product already in favorite" });
      }
      
        await pool.query('UPDATE "user" SET favorite = array_append(favorite, $1) WHERE user_id = $2;', [product_id, user_id])
        res.status(200).json({ message: "Successfully added to favorite"})

    } catch(error) {
      res.status(500).json({ error: "Error trying to add to favorite"})
    }
  }

  export const removeFromFavorite = async (req: Request, res: Response) => {
    const { user_id, product_id } = req.body;

    try {

      const InFavorite = await pool.query('SELECT user_id FROM "user" WHERE ($1 = ANY(favorite) AND user_id = $2);', [product_id, user_id]);
      if (InFavorite.rows.length === 0) {
        return res.status(400).json({ error: "Product is not in favorite" });
      }

      const userExists = await pool.query('SELECT user_id FROM "user" WHERE user_id = $1;', [user_id]);
      if(userExists.rows.length === 0) {
        return res.status(404).json({ error: "User does not exist" })
      }

      await pool.query('UPDATE "user" SET favorite = array_remove(favorite, $1) WHERE user_id = $2;', [product_id, user_id]);
      res.status(200).json({ message: "Successfully removed from favorite" })
      
    } catch (error) {
      res.status(500).json({ error: "Failed to remove from favorite" });
    }
  };

  export const isInFavorite = async (req: Request, res: Response) => {
    const { product_id, user_id } = req.body;
    try {
    const inFavorite = await pool.query('SELECT user_id FROM "user" WHERE ($1 = ANY(favorite) AND user_id = $2);', [product_id, user_id]);
    if (inFavorite.rows.length === 0) {
      return res.status(200).json(false);
    } else {
      return res.status(200).json(true);
    }
    } catch (error) {
      res.status(500).json({ error: "Could not search in favorite" })
    }
  }
