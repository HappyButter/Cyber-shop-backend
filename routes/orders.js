import express from 'express';
import ordersController from '../controllers/ordersController.js';

const { Router } = express;
const ordersRouter = Router();

ordersRouter.get('/', ordersController.getAllOrdersDetails);
ordersRouter.get('/:id', ordersController.getOrdersDetailsByUserId);
ordersRouter.post('/', ordersController.createOrder);

export default ordersRouter;