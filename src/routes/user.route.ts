import { Router } from "express";
import { sendEmail, verificationCode, deleteGlobalNumber, addUser, signIn, getUniques, getEmailLoggedIn } from '../controller/user.controller';

const router = Router();

export const sendEmailRoute = router.post('/sendEmail', sendEmail);
export const verificationCodeRoute = router.post('/verificationCode', verificationCode);
export const deleteGlobalNumberRoute = router.post('/deleteGlobalNumber', deleteGlobalNumber);
export const addUserRoute = router.post('/addUser', addUser);
export const signInRoute = router.post('/signIn', signIn);
export const getEmailLoggedInRoute = router.post('/getEmailLoggedIn', getEmailLoggedIn);
export const getUniquesRoute = router.get('/getUniques', getUniques);