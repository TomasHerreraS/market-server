import express from 'express';
import cors from 'cors';
import { addUser } from './routes/user.route';

const app = express();

app.use(express.json()); // Permite reconocer y analizar solicitudes en formato JSON
// Middleware para habilitar CORS
app.use(cors());

//routes
app.use(addUser);

app.listen(3001);