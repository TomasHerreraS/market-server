import express from 'express';
import cors from 'cors';
import { sendEmailRoute, verificationCodeRoute, deleteGlobalNumberRoute, addUserRoute, getUniquesRoute, signInRoute } from './routes/user.route';

const app = express();

app.use(express.json()); // Permite reconocer y analizar solicitudes en formato JSON
// Middleware para habilitar CORS
app.use(cors());

//routes
app.use( sendEmailRoute,
        verificationCodeRoute,
        deleteGlobalNumberRoute,
        addUserRoute,
        signInRoute,
        getUniquesRoute);

app.listen(3001);