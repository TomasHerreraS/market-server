import express from 'express';
import cors from 'cors';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';

const app = express();

app.use(express.json()); // Permite reconocer y analizar solicitudes en formato JSON
// Middleware para habilitar CORS
app.use(cors());

//routes
app.use( userRouter, productRouter );

app.listen(3001);