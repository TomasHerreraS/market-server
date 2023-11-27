import { Request, Response } from 'express';
import {Md5} from 'ts-md5';
import jwt from 'jsonwebtoken';
import pool from '../db/db';

export const createUser = async(req: Request, res: Response) => {
  const { name, lastname, rol, email, password, phone, address } = req.body;
  const response = await pool.query('INSERT INTO users ("name", "lastname", "rol", "email", "password", "phone", "address") VALUES ($1, $2, $3, $4, $5, $6, $7)',
  [name, lastname, rol, email, Md5.hashStr(password), phone, address])
  res.json({name, lastname, email, phone, address})
  return response;
}