import { Router } from "express";
import { getAllProducts, getQuantity, buyProduct, getProductTable, getProductLength } from "../controller/product.controller";

const router = Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getQuantity', getQuantity);
router.get('/getProductTable', getProductTable);
router.get('/getProductLength', getProductLength);
router.post('/buyProduct', buyProduct);

export default router;