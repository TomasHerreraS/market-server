import { Router } from "express";
import { sendEmail, verificationCode, deleteGlobalNumber, addUser, signIn, getUniques, getRole, getAllUsers, deleteUser } from '../controller/user.controller';

const router = Router();

router.post('/sendEmail', sendEmail);
router.post('/verificationCode', verificationCode);
router.post('/deleteGlobalNumber', deleteGlobalNumber);
router.post('/addUser', addUser);
router.post('/signIn', signIn);
router.post('/getRole', getRole);
router.get('/getUniques', getUniques);
router.get('/getAllUsers', getAllUsers);
router.post('/deleteUser', deleteUser)

export default router;