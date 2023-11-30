import { Request, Response } from 'express';
import {Md5} from 'ts-md5';
import jwt from 'jsonwebtoken';
import pool from '../db/db';

export const createUser = async(req: Request, res: Response) => {
  const { name, lastname, rol_id, email, password, phone, state, city, address } = req.body;
  const response = await pool.query('INSERT INTO users ("name", "lastname", "rol_id", "email", "password", "phone", "state", "city", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
  [name, lastname, rol_id, email, Md5.hashStr(password), phone, state, city, address])
  res.json({name, lastname, email, phone, state, city, address})
  return response;
}