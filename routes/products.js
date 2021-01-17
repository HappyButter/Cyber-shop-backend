import express from 'express';
import productsController from '../controllers/productsController.js';

const { Router } = express;
const productsRouter = Router();

productsRouter.get('/names', productsController.getAllProductsNames);
productsRouter.get('/category/:id', productsController.getProductsByCategoryId);
productsRouter.get('/recommended', productsController.getRecommendedProducts);
productsRouter.get('/promo/:id', productsController.getProductsByPromoId);
productsRouter.put('/create', productsController.createProduct);
productsRouter.post('/update/:id', productsController.updateProduct);
productsRouter.delete('/delete/:id', productsController.deleteProduct);



export default productsRouter;