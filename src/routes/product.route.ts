import { Router } from "express";
import { getAllProducts, getQuantity, buyProduct, deleteProduct, updateProduct, addProduct, getProductById } from "../controller/product.controller";

const router = Router();

router.get('/getAllProducts', getAllProducts);
router.get('/getQuantity', getQuantity);
router.post('/buyProduct', buyProduct);
router.post('/deleteProduct', deleteProduct);
router.post('/updateProduct', updateProduct);
router.post('/addProduct', addProduct);
router.post('/getProductById', getProductById)

export default router;