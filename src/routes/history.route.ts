import { Router } from "express";
import { getHistoryLength, getAllHistoryTable, getHistoryTableByFilter } from "../controller/history.controller";

const router = Router();

router.get('/getHistoryLength', getHistoryLength);
router.get('/getHistoryTable', getAllHistoryTable);
router.get('/getHistoryTableByFilter', getHistoryTableByFilter);

export default router;