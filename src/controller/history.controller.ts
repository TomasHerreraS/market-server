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
  
export const getAllHistoryTable = async (req: Request, res: Response) => {
  try{
    const result = await pool.query(`SELECT "date", "role", "action", "table", description FROM history
    ORDER BY history_id ASC`);
    res.json(result.rows)
  }catch(error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}

export const getHistoryTableByFilter = async (req: Request, res: Response) => {
  try{
    const { filters, limit, offset, date }: any = req.query;
    const initDate = date.initDate;
    const finalDate = date.finalDate;
    let nonEmptyValues: any = {}; // Guarda en un objeto los valores que no son string vacío
    let filledKeys: string[] = []; // Guarda las keys del objeto que no son string vacío
    let filledValues; // Guarda los values del objeto que no son string vacío
    let filledValuesLength = 0; // Guarda el legnth del objeto que no son string vacío
    let text = [];
    let condition = '';
    for (const key in filters) {
      if (filters.hasOwnProperty(key) && filters[key] !== '') {
        nonEmptyValues[key] = filters[key];
        filledKeys = Object.keys(nonEmptyValues);
        filledValues = Object.values(nonEmptyValues);
        filledValuesLength = filledValues.length;
      }
    }

    if (filledKeys && filledValues) {
      for (let i = 0; i < filledValuesLength; i++) {
        text.push(`${filledKeys[i] !== 'email' && filledKeys[i] !== 'phone' ? `"${filledKeys[i]}" = '${filledValues[i]}'`: `"${filledKeys[i]}" ILIKE '${filledValues[i]}%'`} ${i < filledValuesLength - 1 ? 'AND' : ''}`)
      }
    }
    condition = text.join(' ')
    // res.json(condition);
    // TODO: Hacer otra const sacada de req.query, que sea date{initial, final}, y aplicarla aquí abajo luego de condition : 
    res.json(`SELECT * FROM history
    ${filledValuesLength > 0 || (initDate.length > 0 && finalDate.length > 0) ? 'WHERE' : ''} 
    ${(condition.length > 0 && (initDate.length === 0 || finalDate.length === 0)) ? condition :
      (initDate.length > 0 && finalDate.length > 0 ? `date BETWEEN '${initDate}' AND '${finalDate}'` : '')}
    ${condition.length > 0 && (initDate.length > 0 && finalDate.length > 0) ? `AND ${condition}` : ''} 
    ORDER BY history_id 
    LIMIT $1 OFFSET $2`);
    // const result = await pool.query(`SELECT * from history
    // ${filledValuesLength > 0 || initDate.length > 0 && finalDate.length ? 'WHERE' : ''} 
    // ${condition.length > 0 ? condition : initDate.length > 0 && finalDate.length > 0 ? `date BETWEEN '${initDate}' AND '${finalDate}'`: ''} 
    // ORDER BY history_id 
    // LIMIT $1 OFFSET $2`, [limit, offset]);
    // res.json(result.rows)
  }catch(error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing the request.'})
  }
}