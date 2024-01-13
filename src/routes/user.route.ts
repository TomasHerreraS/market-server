import { Router } from "express";
import { sendEmail, verificationCode, deleteGlobalNumber, addUser, getUniques } from '../controller/user.controller';

const router = Router();

export const sendEmailRoute = router.post('/sendEmail', sendEmail);
export const verificationCodeRoute = router.post('/verificationCode', verificationCode);
export const deleteGlobalNumberRoute = router.post('/deleteGlobalNumber', deleteGlobalNumber);
export const addUserRoute = router.post('/addUser', addUser);
export const getUniquesRoute = router.get('/getUniques', getUniques);