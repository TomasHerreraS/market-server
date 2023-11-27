import { Router } from "express";
import { createUser } from '../controller/user.controller';

const router = Router();

export const addUser = router.post('/addUser', createUser);