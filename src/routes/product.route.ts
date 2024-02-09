import { Router } from "express";
import { getAllProducts, getQuantity } from "../controller/product.controller";

const router = Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getQuantity', getQuantity);

export default router;