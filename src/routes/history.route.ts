import { Router } from "express";
import { getHistoryLength, getHistoryTable } from "../controller/history.controller";

const router = Router();

router.get('/getHistoryLength', getHistoryLength);
router.get('/getHistoryTable', getHistoryTable);

export default router;