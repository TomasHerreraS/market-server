import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'), // Convertir el puerto a un número entero
});

export default pool;