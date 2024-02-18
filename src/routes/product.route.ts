import { Router } from "express";
import { getAllProducts, getQuantity, buyProduct } from "../controller/product.controller";

const router = Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getQuantity', getQuantity);
router.post('/buyProduct', buyProduct);

export default router;