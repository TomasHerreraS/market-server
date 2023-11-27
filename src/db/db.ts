import { Pool } from 'pg';

const pool = new Pool({
  user: 'superuser',
  host: 'localhost',
  database: 'market',
  password: 'superuser',
  port: 5432, // Este es el port por defecto
});

export default pool;