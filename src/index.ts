import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server, Socket } from 'socket.io';
import userRouter from './routes/user.route';
import productRouter from './routes/product.route';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Permite reconocer y analizar solicitudes en formato JSON
// Middleware para habilitar CORS
app.use(cors());


const io = new Server(server, { cors: { origin: '*' } });


// Exporta el objeto 'io' para que esté disponible en otros archivos
export { io };

//routes
app.use( userRouter, productRouter );

server.listen(PORT, () => {
  console.log(`Servidor de Socket.IO escuchando en el puerto ${PORT}`);
});