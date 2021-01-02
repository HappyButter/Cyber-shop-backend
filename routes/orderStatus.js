import express from 'express';
import orderStatusController from '../controllers/orderStatusController.js';

const { Router } = express;
const orderStatusRouter = Router();

// in progress

// orderStatusRouter.get('/user/:id', statusController.getUserAddresses);
// orderStatusRouter.get('/order/:id', statusController.getOrderAddress);
// orderStatusRouter.post('/', statusController.createAddress);
// orderStatusRouter.put('/:id', statusController.updateAddress);
// orderStatusRouter.delete('/:id', statusController.deleteAddress);

export default orderStatusRouter;