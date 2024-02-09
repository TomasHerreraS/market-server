import { Router } from "express";
import { sendEmail, verificationCode, deleteGlobalNumber, addUser, signIn, getUniques, getEmailLoggedIn } from '../controller/user.controller';

const router = Router();

router.post('/sendEmail', sendEmail);
router.post('/verificationCode', verificationCode);
router.post('/deleteGlobalNumber', deleteGlobalNumber);
router.post('/addUser', addUser);
router.post('/signIn', signIn);
router.post('/getEmailLoggedIn', getEmailLoggedIn);
router.get('/getUniques', getUniques);

export default router;