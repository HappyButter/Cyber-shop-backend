import express from 'express';
import productsController from '../controllers/productsController.js';

const { Router } = express;
const productsRouter = Router();

productsRouter.get('/', productsController.getAllProducts);
productsRouter.get('/:categoryId', productsController.getProductsByCategoryName);
// usersRouter.post('/', usersController.createUser);
// usersRouter.put('/:id', usersController.updateUser);
// usersRouter.delete('/:id', usersController.deleteUser);


export default productsRouter;