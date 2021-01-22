import express from 'express';
import productsServiceController from '../controllers/productsServiceController.js';

const { Router } = express;
const productsServiceRouter = Router();

productsServiceRouter.get('/', productsServiceController.getProductsInService);
productsServiceRouter.put('/create', productsServiceController.addProductInService);
productsServiceRouter.post('/update/:id', productsServiceController.updateProductInService);

export default productsServiceRouter;
