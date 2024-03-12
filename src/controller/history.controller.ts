import { Request, Response } from 'express';
import pool from '../db/db';

export const getHistoryLength = async (req: Request, res: Response) => {
    try{
      const result = await pool.query('SELECT COUNT(*) FROM history;');
      res.json(result.rows[0].count);
    } catch(error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  }
  
  export const getHistoryTable = async (req: Request, res: Response) => {
    try{
      const { limit, offset } = req.query;
      const result = await pool.query(`SELECT history_id, "action", "table", description, user_id FROM history
      ORDER BY history_id ASC LIMIT $1 OFFSET $2;`, [limit, offset]);
      res.json(result.rows)
    }catch(error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
  }