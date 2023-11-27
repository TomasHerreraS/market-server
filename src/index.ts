import express from 'express';
import cors from 'cors';
import { addUser } from './routes/user.route';

const app = express();

// Middleware para habilitar CORS
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Ruta de ejemplo
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});

const PORT = 3001; // Puerto en el que se ejecutará el servidor

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});